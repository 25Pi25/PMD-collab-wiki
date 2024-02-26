import Emotions from "./emotions"
import SpritePreview from "./sprite-preview"
import { Dungeon, IPMDCollab } from "../types/enum"
import { useEffect, useRef, useState } from "react"
import { MonsterForm } from "../generated/graphql"
import Bounty from "./bounty"
import {
  Box,
  Divider,
  Grid,
  Link,
  Paper,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses
} from "@mui/material"
import { getLastModification } from "../util"
import { CreditsPrimary, CreditsSecondary } from "./credits"
import { XMLParser } from 'fast-xml-parser'
import { Stage } from '@pixi/react'

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: "1rem"
  }
}))

interface Props {
  info: MonsterForm
  infoKey: number
}
export default function PokemonInformations({
  info: { sprites, portraits }
}: Props) {
  const [animData, setAnimData] = useState<IPMDCollab>();
  useEffect(() => {
    (async () => {
      if (!sprites.animDataXml) return;
      const xmlData = await (await fetch(sprites.animDataXml)).text();
      const parser = new XMLParser();
      setAnimData(parser.parse(xmlData) as IPMDCollab);
    })();
  }, [sprites.animDataXml]);

  const animList = animData?.AnimData.Anims.Anim;
  const animNames = animList?.map(anim => anim.Name);
  const sortedActions = !animNames ? sprites.actions : [...sprites.actions]
    .sort((a, b) => animNames.indexOf(a.action) - animNames.indexOf(b.action));

  const bg = useRef<Dungeon>(Object.values(Dungeon)[Math.floor(Math.random() * Object.values(Dungeon).length)]);
  const portraitDate = portraits.modifiedDate && new Date(portraits.modifiedDate)
  const spriteDate = sprites.modifiedDate && new Date(sprites.modifiedDate)
  const portraitSheetUrl = portraits.sheetUrl && (
    <Link target="_blank" href={portraits.sheetUrl}>
      <Typography>Download all portraits</Typography>
    </Link>
  )
  const portraitRecolorSheetUrl = portraits.recolorSheetUrl && (
    <Link target="_blank" href={portraits.recolorSheetUrl}>
      <Typography>Download recolor portraits</Typography>
    </Link>
  )
  const zipUrl = sprites.zipUrl && (
    <Link target="_blank" href={sprites.zipUrl}>
      <Typography>Download all sprites</Typography>
    </Link>
  )
  const spriteRecolorSheetUrl = sprites.recolorSheetUrl && (
    <Link target="_blank" href={sprites.recolorSheetUrl}>
      <Typography>Download recolor sprites</Typography>
    </Link>
  )
  return (
    <Box>
      <Box sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography fontWeight="bold" variant="h5">
              Portraits
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{getLastModification(portraitDate)}</Typography>
          </Grid>
          <Grid item>
            <Bounty bounty={portraits.bounty} />
          </Grid>
          <Grid item>{portraitSheetUrl}</Grid>
          <Grid item>{portraitRecolorSheetUrl}</Grid>
          <Grid item>
            <CreditsPrimary primary={portraits.creditPrimary} />
          </Grid>
          {portraits.creditSecondary.length > 0 && (
            <Grid item>
              <CreditsSecondary secondary={portraits.creditSecondary} />
            </Grid>
          )}
        </Grid>

        {portraits.emotions.length ? (
          <Emotions
            emotions={portraits.emotions.concat(portraits.emotionsFlipped)}
            history={portraits.history.filter((e) => !e.obsolete)}
          />
        ) : (
          <Typography variant="h5">{
            portraits.required ? "No portraits available for now." : "This form's portraits are unnecessary."
          }</Typography>
        )}
      </Box>
      <Divider />
      <Box sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography fontWeight="bold" variant="h5">
              Sprites
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{getLastModification(spriteDate)}</Typography>
          </Grid>
          <Grid item>
            <Bounty bounty={sprites.bounty} />
          </Grid>
          <Grid item>{zipUrl}</Grid>
          <Grid item>{spriteRecolorSheetUrl}</Grid>
          <Grid item>
            <CreditsPrimary primary={sprites.creditPrimary} />
          </Grid>
          {sprites.creditSecondary?.length > 0 && (
            <Grid item>
              <CreditsSecondary secondary={sprites.creditSecondary} />
            </Grid>
          )}
        </Grid>

        {sprites.actions.length ? (
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {animList && sortedActions.map(
              (sprite, i) =>
                sprite.__typename === "Sprite" &&
                (
                  <Grid item key={sprite.action}>
                    <Paper elevation={2}>
                      <SpritePreview
                        dungeon={bg.current}
                        sprite={sprite}
                        animData={animData}
                        history={sprites.history.filter((e) => !e.obsolete)}
                        i={i}
                      />
                    </Paper>
                  </Grid>
                )
            )}
          </Grid>
        ) : (
          <Typography variant="h6">{
            portraits.required ? "No sprites available for now." : "This form's sprites are unnecessary."
          }</Typography>
        )}
      </Box>
      <Divider />
    </Box>
  )
}

