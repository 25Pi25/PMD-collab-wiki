import PokemonCarousel from "./components/pokemon-carousel"
import Search from "./components/search"
import { createContext, useState } from "react"
import { RankMethod } from "./types/enum"
import DisplayParameters from "./components/display-parameters"
import PokemonRanking from "./components/pokemon-ranking"
import { Meta } from "./generated/graphql"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material"
import { Bar } from "./components/bar"
import { Footer } from "./components/footer"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Filter, MiscParams, Toggle, filters, miscParams, paramsToMap, paramsToObject, toggles } from "./types/params"
import { SetURLSearchParams, useSearchParams } from 'react-router-dom'
import { UseState, toggleParamCallback } from './util'

export const Context = createContext<{
  searchParamsState: [URLSearchParams, SetURLSearchParams]
  toggleState: Map<Toggle, boolean>
  filterState: Map<Filter, boolean>
  miscState: Record<MiscParams, boolean>
  rankState: UseState<RankMethod>
} | null>(null);

export default function Home({ ids, meta }: { ids: number[]; meta: Meta }) {
  const textState = useState(""), [currentText] = textState;
  const rankState = useState<RankMethod>(RankMethod.POKEDEX_NUMBER);
  // the lord the savior use search params
  const searchParamsState = useSearchParams(), [searchParams, setSearchParams] = searchParamsState;
  // TODO: make these objects instead of maps
  const toggleState = paramsToMap<Toggle, boolean>(searchParams, toggles, param => param === "true");
  const filterState = paramsToMap<Filter, boolean>(searchParams, filters, param => param === "true");
  const miscState = paramsToObject<MiscParams, boolean>(searchParams, miscParams, param => param === "true");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Context.Provider value={{ searchParamsState, toggleState, filterState, miscState, rankState }}>
      <Box>
        <Bar />
        {/* TODO: put this in a different component */}
        <Container maxWidth="xl" sx={{ backgroundColor: "rgba(255,255,255,.9)" }}>
          {searchParams.get("beta") === "true" && <FormControlLabel
            sx={{ position: 'absolute' }}
            label={<Typography color="text.secondary">Credits Mode</Typography>}
            control={<Checkbox
              checked={miscState.creditsMode}
              onChange={async e => setSearchParams(toggleParamCallback('creditsMode', e.target.checked))}
            />}
          />}
          <Typography
            variant={isMobile ? "subtitle2" : "h5"}
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Free to use <strong><Link href='#/About' className='with-credit'>WITH CREDIT</Link></strong> for ROMhacks, fangames, etc. Don't use for
            commercial projects.
          </Typography>
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography
              variant={isMobile ? "subtitle2" : "h5"}
              align="center"
              color="text.secondary"
              gutterBottom
            >
              Search for a pokemon, artist or pokedex number ...
            </Typography>
            <Search textState={textState} />
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="text.secondary">
                  Searching options
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DisplayParameters />
                <PokemonRanking />
              </AccordionDetails>
            </Accordion>
          </Container>

          <PokemonCarousel
            currentText={currentText}
            ids={ids}
          />
          <Footer meta={meta} />
        </Container>
      </Box>
    </Context.Provider>
  )
}
