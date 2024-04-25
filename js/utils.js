export function randomId(letters = 3, digitsInPart = 6) {
  const lettersArray = "abcdefghijkmnopqrstuvwxyz";
  let randomLetters = "";

  if ((letters === 0) & (digitsInPart === 0)) {
    throw new Error("At least one argument must be greater than 0");
  }

  for (let i = 0; i < letters; i++) {
    randomLetters += lettersArray.charAt(
      Math.floor(Math.random() * lettersArray.length)
    );
  }

  const partOne = Math.random()
    .toString()
    .slice(2, digitsInPart + 2);
  const partTwo = Math.random()
    .toString()
    .slice(2, digitsInPart + 2);
  const partThree = Math.random()
    .toString()
    .slice(2, digitsInPart + 2);

  return `${randomLetters}${partOne}${partTwo}${partThree}`;
}
