const fs = require("fs");
const path = require("path");
const sass = require("sass");
const { types } = require("util");

/**
 *
 * compile any scss file to css
 * @param {string} src
 * @param {string} output
 *
 */

const compile = (src, output) => {
  const result = sass.compile(path.resolve(src), {
    style: "expanded",
    verbose: true,
  });

  fs.writeFileSync(path.resolve(output), result.css);
};

// check that if dist folder exists or not if not then create it in the scss
// directory
if (!fs.existsSync(path.resolve("dist"))) {
  fs.mkdirSync(path.resolve("dist"));
}

// compile the scss files
compile("src/global.scss", "dist/global.css");

/**
 *
 * Get All Components from atoms, molecules, organisms
 * @returns Object[] return an array of objects containing src and output
 *
 */
const getComponents = () => {
  let allComponents = [];
  let types = ["atoms", "molecules", "organisms"];

  types.forEach((type) => {
    const allFiles = fs
      .readdirSync(path.resolve(`src/${type}`))
      .map((file) => ({
        src: `src/${type}/${file}`,
        output: `dist/${file.slice(0, -5)}.css`,
      }));

    allComponents = [...allComponents, ...allFiles];
  });

  return allComponents;
};

getComponents().forEach((component) => {
  compile(component.src, component.output);
});
