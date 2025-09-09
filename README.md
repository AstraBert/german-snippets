# german-snippets

## Get better at German, one snippet at a time

**german-snippets** is an application designed to help you learn more than 2500+ words and expression from German based on their definition: you search them, you learn them!

### Set up

> _If you are not a developer, there is no need to manually set up this app! You can use it directly from the [online demo](https://de.clelia.dev)_

#### Download data (Python)

> Source code is [here](data/src/german_snippets_data/)

Install the python package to download the data:

```bash
pip install german-snippets-data
```

Run the command to download the JSON file:

```bash
get-german-snippets
```

You will now have the file saved as `./german-snippets.json`.

#### Upload data to Qdrant (Go)

> Source code is [here](./german-snippets-qdrant/)

For this step, you will need a Qdrant Cluster (get one [here](https://qdrant.tech)) with a `QDRANT_ENDPOINT` and a `QDRANT_API_KEY` environment variable, as well as an `OPENAI_API_KEY` for embeddings:

```bash
export QDRANT_ENDPOINT="xyz.europe-central.gc.qdrant.io" # no 'https://' at the beginning!
export QDRANT_API_KEY="your-api-key"
export OPENAI_API_KEY="sk-...-api-key"
```

Now install the executable to upload all the text embeddings (derived from `german-snippets.json`) to your Qdrant cluster (in a collection named `germanSnippets`):

```bash
npm install @cle-does-things/german-snippets-qdrant
```

And run it (from the same folder where you have the JSON file):

```bash
german-snippets-qdrant
```

The program will log all its steps.

#### Run the app (NextJS)

Clone the GitHub repo:

```
git clone https://github.com/AstraBert/german-snippets
cd german-snippets-app/
```

Along with the already exported env variables, you will need to export a `QDRANT_URL`:

```bash
export QDRANT_URL="https://xyz.europe-central.gc.qdrant.io"
```

Now you need to install all the dependencies:

```bash
npm install
```

Now that you are all set, you can run the development application and access it at `http://localhost:3000`:

```bash
npm run dev
```

### License

This project is distributed under the [MIT License](./LICENSE)
