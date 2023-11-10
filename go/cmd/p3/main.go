package main

import (
	"fmt"
	"strings"
)

func getInput() string {
	return `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`
}

func main() {

	result := 0
	for r, line := range strings.Split(getInput(), "\n") {
    if string(line[r * 3 % len(line)]) == "#" {
			result++
		}
	}

  fmt.Printf("Tree: %v\n", result)
}
