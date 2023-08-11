import { Monster } from './generated/graphql';

const pad = (number: number) => number < 10 ? `0${number}` : number.toString();

export function formatDate(n: number) {
    const date = new Date(n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear().toString().slice(2)}`;
}

export function getLastModification(t?: Date) {
    return t ? `Modified at ${formatDate(t.getTime())}` : "";
}

export const getMonsterMaxPortraitBounty = (monster: Monster) => monster.forms.reduce(
    (a, { sprites: { bounty: { exists, full, incomplete } } }) => Math.max(
        a,
        exists || 0,
        full || 0,
        incomplete || 0
    ), 0)

export const getMonsterMaxSpriteBounty = (monster: Monster) => monster.forms.reduce(
    (a, { sprites: { bounty: { exists, full, incomplete } } }) => Math.max(
        a,
        exists || 0,
        full || 0,
        incomplete || 0
    ), 0)