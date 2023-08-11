/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react"
import ReactDOM from "react-dom/client"
import Home from "./Home"
import { HashRouter, Routes, Route } from "react-router-dom"
import PokemonPage from "./components/pokemon-page"
import NotFound from "./NotFound"
import About from "./About"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { KeysDocument, KeysQueryResult } from "./generated/graphql"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline, createTheme } from "@mui/material"
import "./index.css"
import Contributors from "./Contributors"

const defaultTheme = createTheme({ typography: { fontFamily: "wonderMail" } })
const client = new ApolloClient({
  uri: "https://spriteserver.pmdcollab.org/graphql",
  cache: new InMemoryCache()
})

async function initialize() {
  const result = await client.query({ query: KeysDocument }) as KeysQueryResult;
  if (!result.data) return;
  const sortedMonsters = [...result.data.monster].sort((a, b) => a.id - b.id);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    meta={result.data.meta}
                    ids={sortedMonsters.map(m => m.id)}
                  />
                }
              />
              {sortedMonsters.map(({ id, rawId }, i) => (
                <Route
                  key={rawId}
                  path={`/${rawId}`}
                  element={
                    <PokemonPage
                      infoKey={id}
                      rawId={rawId}
                      prevIndex={sortedMonsters[i - 1]?.rawId}
                      nextIndex={sortedMonsters[i + 1]?.rawId}
                    />
                  }
                />
              ))}
              <Route path="/About" element={<About />} />
              <Route path="/Contributors" element={<Contributors />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </ApolloProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

initialize()
