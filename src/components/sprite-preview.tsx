import { Stage } from '@pixi/react'
import { MonsterHistory, Sprite } from "../generated/graphql"
import { Dungeon, IPMDCollab } from "../types/enum"
import Lock from "./lock"
import { Card, Grid, Typography } from "@mui/material"
import { lazy, useEffect, useState } from 'react'

interface Props {
  sprite: Sprite
  dungeon: Dungeon
  animData: IPMDCollab
  history: MonsterHistory[]
  i: number
}
export default function SpritePreview({ sprite, dungeon, animData, history, i }: Props) {
  return (
    <Card>
      {i < 16 && <Stage width={200} height={200}></Stage>}
      <Grid container justifyContent="center" alignItems="start">
        <Lock
          locked={sprite.locked}
          history={history.filter((e) =>
            e.modifications.includes(sprite.action)
          )}
        />
        <Typography align="center">{sprite.action}</Typography>
      </Grid>
    </Card>
  )
}
