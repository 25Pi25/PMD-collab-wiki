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
import { useRef } from "react"
import { MonsterForm } from "../generated/graphql"
import { useAnimData } from "../hooks/useAnimData"
import { Dungeon } from "../types/enum"
import { getLastModification } from "../util"
import Bounty from "./bounty"
import { CreditsPrimary, CreditsSecondary } from "./credits"
import Emotions from "./emotions"
import SpritePreview from "./sprite-preview"

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
  info: MonsterForm | undefined
  infoKey: number
}
export default function PokemonInformations({ info, infoKey }: Props) {
  const bg = useRef<Dungeon>(
    Object.values(Dungeon)[
      Math.floor(Math.random() * Object.values(Dungeon).length)
    ]
  )

  const sprites = info?.sprites
  const animDataXml = info?.sprites.animDataXml
  const portraits = info?.portraits
  const { data, isLoading } = useAnimData(animDataXml)

  if (portraits && sprites) {
    const portraitDate =
      portraits.modifiedDate && new Date(portraits.modifiedDate)
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
            <Typography variant="h5">
              {portraits.required
                ? "No portraits available for now."
                : "This form's portraits are unnecessary."}
            </Typography>
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
          {sprites.actions.length && data?.Anims?.Anim?.length ? (
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {animDataXml &&
                sprites.actions.map(
                  (sprite) =>
                    sprite.__typename === "Sprite" && (
                      <Grid item key={sprite.action}>
                        <Paper elevation={2}>
                          <SpritePreview
                            dungeon={bg.current}
                            sprite={sprite}
                            animationData={data}
                            history={sprites.history.filter((e) => !e.obsolete)}
                            infoKey={infoKey}
                          />
                        </Paper>
                      </Grid>
                    )
                )}
            </Grid>
          ) : (
            <Typography variant="h6">
              {isLoading
                ? "Loading"
                : portraits.required
                ? "No sprites available for now."
                : "This form's sprites are unnecessary."}
            </Typography>
          )}
        </Box>
        <Divider />
      </Box>
    )
  } else {
    return null
  }
}
