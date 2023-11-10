function getInput(): string {
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
.#..#...#.#`;
}



const map = getInput()
  .split("\n")
.map(x=> x.split("")); // .map(x=> x === "." ? MapTree.snow : MapTree.tree))

const colLen = map[0].length;
let result = 0;

map.forEach((row, i)=> {
  if(row[(i*3%colLen)] === "#"){
    result++;
  }
})

console.log("Tree Count", result);
