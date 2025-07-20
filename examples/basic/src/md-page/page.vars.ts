// Pages all support a page.vars.ts, though its not usually necessary since most
// pages support some form of in-page variable declaration.
//
// Here we see that the title is overridden from the variables file.

interface MdPageVars {
  title: string;
  [key: string]: unknown;
}

const pageVars: MdPageVars = {
  title: 'Nested Markdown Title From Var File',
}

export default pageVars
