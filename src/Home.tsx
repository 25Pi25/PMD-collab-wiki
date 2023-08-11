import PokemonCarousel from "./components/pokemon-carousel"
import Search from "./components/search"
import { Dispatch, SetStateAction, useState } from "react"
import { RankMethod } from "./types/enum"
import DisplayParameters from "./components/display-parameters"
import PokemonRanking from "./components/pokemon-ranking"
import { Meta } from "./generated/graphql"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material"
import { Bar } from "./components/bar"
import { Footer } from "./components/footer"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

export type ShowParameters = Record<string, {
  state: [boolean, Dispatch<SetStateAction<boolean>>],
  rankMethod?: RankMethod,
  name: string
}>

export default function Home({ ids, meta }: { ids: number[]; meta: Meta }) {
  const [currentText, setCurrentText] = useState("")
  const [rankBy, setRankBy] = useState<RankMethod>(RankMethod.POKEDEX_NUMBER)
  const showParameters: ShowParameters = {
    index: { rankMethod: RankMethod.POKEDEX_NUMBER, name: "Index", state: useState<boolean>(false) },
    portraitAuthor: { rankMethod: RankMethod.PORTRAIT_AUTHOR, name: "Portrait Author", state: useState<boolean>(false) },
    spriteAuthor: { rankMethod: RankMethod.SPRITE_AUTHOR, name: "Sprite Author", state: useState<boolean>(false) },
    lastModification: { rankMethod: RankMethod.LAST_MODIFICATION, name: "Last Change", state: useState<boolean>(false) },
    portraitBounty: { rankMethod: RankMethod.PORTRAIT_BOUNTY, name: "Portrait Bounty", state: useState<boolean>(false) },
    spriteBounty: { rankMethod: RankMethod.SPRITE_BOUNTY, name: "Sprite Bounty", state: useState<boolean>(false) },
    fullyFeaturedSprites: { name: "Fully-Featured Portraits", state: useState<boolean>(false) },
    fullyFeaturedPortraits: { name: "Fully-Featured Sprites", state: useState<boolean>(false) },
  }
  const isMobile = useMediaQuery(useTheme().breakpoints.down("md"))

  return (
    <Box>
      <Bar />
      <Container maxWidth="xl" sx={{ backgroundColor: "rgba(255,255,255,.9)" }}>
        <Typography
          variant={isMobile ? "subtitle2" : "h5"}
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Free to use <strong>WITH CREDIT</strong> for ROMhacks, fangames, etc. Don't use for
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
          <Search currentText={currentText} setCurrentText={setCurrentText} />
          {!isMobile && (
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="text.secondary">
                  Searching options
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DisplayParameters showParameters={showParameters} />
                <PokemonRanking
                  showParameters={showParameters}
                  setRankBy={setRankBy}
                  rankBy={rankBy}
                />
              </AccordionDetails>
            </Accordion>
          )}
        </Container>

        <PokemonCarousel
          currentText={currentText}
          rankBy={rankBy}
          showParameters={showParameters}
          ids={ids}
        />
        <Footer meta={meta} />
      </Container>
    </Box>
  )
}
