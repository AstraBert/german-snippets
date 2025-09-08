package loadjson

import (
	"encoding/json"
	"io"
	"os"
)

type GermanSnippet struct {
	Title               string `json:"title"`
	Explanation         string `json:"explanation"`
	DetailedExplanation string `json:"detailed_explanation"`
}

type GermanDataset struct {
	Snippets []GermanSnippet `json:"snippets"`
}

func LoadJson(path string) (*GermanDataset, error) {
	jsonFile, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer jsonFile.Close()

	byteValue, errRead := io.ReadAll(jsonFile)

	if errRead != nil {
		return nil, errRead
	}

	var snippets *GermanDataset
	errJs := json.Unmarshal(byteValue, &snippets)

	if errJs != nil {
		return nil, errJs
	}

	return snippets, nil
}
