import { Position } from '../types/Positions';

export function getPositionBetweenPoints(from: Phaser.Geom.Point, to: Phaser.Geom.Point): Position {
    const absDistanceX = Math.abs(to.x - from.x);
    const absDistanceY = Math.abs(to.y - from.y);

    if (from.x > to.x && absDistanceX >= absDistanceY) {
        return Position.LEFT;
    }
    else if (from.x < to.x && absDistanceX >= absDistanceY) {
        return Position.RIGHT;
    }
    else if (from.y > to.y) {
        return Position.UP;
    }
    else {
        return Position.DOWN;
    }
}