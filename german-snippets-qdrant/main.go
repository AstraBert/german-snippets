package main

import (
	"context"
	"fmt"
	"german-snippets-qdrant/embedding"
	loadjson "german-snippets-qdrant/load_json"

	"github.com/qdrant/go-client/qdrant"
)

func createBatches(data []string, batchSize int) [][]string {
	numBatches := (len(data) + batchSize - 1) / batchSize
	batches := make([][]string, 0, numBatches)

	for i := 0; i < len(data); i += batchSize {
		end := i + batchSize
		if end > len(data) {
			end = len(data)
		}
		batches = append(batches, data[i:end])
	}

	return batches
}

func main() {
	jsonData, errJs := loadjson.LoadJson("german-snippets.json")
	if errJs != nil {
		fmt.Println(errJs.Error())
		return
	}
	texts := []string{}
	for _, item := range jsonData.Snippets {
		texts = append(texts, item.Explanation)
	}
	fmt.Println("Loaded text content from german-snippets.json")
	text_batches := createBatches(texts, 100)
	embds := [][]float64{}
	for _, batch := range text_batches {
		embd, errEmbd := embedding.BatchEmbedText(batch)
		if errEmbd != nil {
			continue
		} else {
			embds = append(embds, embd...)
		}
	}
	fmt.Printf("Created embeddings for %d text snippets out of %d (%f percent)\n", len(embds), len(texts), (float32(len(embds)) * 100 / float32(len(texts))))

	qdrantClient, errQd := qdrant.NewClient(&qdrant.Config{
		Host: "localhost",
		Port: 6334,
	})

	if errQd != nil {
		fmt.Println(errQd.Error())
		return
	}

	vectorPoints := []*qdrant.PointStruct{}

	for i, item := range embds {
		vectorSlice := make([]float32, len(item))
		for k, v := range item {
			vectorSlice[k] = float32(v)
		}
		vectorPoints = append(vectorPoints, &qdrant.PointStruct{
			Id:      qdrant.NewIDNum(uint64(i)),
			Vectors: qdrant.NewVectors(vectorSlice...),
			Payload: qdrant.NewValueMap(map[string]any{"title": jsonData.Snippets[i].Title, "explanation": jsonData.Snippets[i].DetailedExplanation}),
		})
	}

	fmt.Println("Created vector points, preparing for upsertion...")

	errColl := qdrantClient.CreateCollection(context.Background(), &qdrant.CreateCollection{
		CollectionName: "germanSnippets",
		VectorsConfig: qdrant.NewVectorsConfig(&qdrant.VectorParams{
			Size:     768,
			Distance: qdrant.Distance_Cosine,
		}),
	})

	fmt.Println("Created collection germanSnippets")

	if errColl != nil {
		fmt.Println(errColl.Error())
	}

	operationInfo, errOp := qdrantClient.Upsert(context.Background(), &qdrant.UpsertPoints{CollectionName: "germanSnippets", Points: vectorPoints})

	if errOp != nil {
		fmt.Println(errOp.Error())
		return
	} else {
		fmt.Println("Upserted points to germanSnippets")
		fmt.Printf("Operation Status %v\n", operationInfo.Status)
		return
	}
}
