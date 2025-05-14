import TurndownService from 'turndown';

export async function buildDomTree(htmlString: string): Promise<string> {
  console.log('Num of chars before simplification:', htmlString.length);

  const turndown = new TurndownService();
  const markdown = turndown.turndown(htmlString);

  // Use markdown to convert the html string to a dom tree

  // // Remove all comments
  // htmlString = htmlString.replace(/<!--[\s\S]*?-->/g, '');
  // // Remove all script tags
  // htmlString = htmlString.replace(/<script[\s\S]*?<\/script>/g, '');
  // // Remove all style tags
  // htmlString = htmlString.replace(/<style[\s\S]*?<\/style>/g, '');
  // // Remove all link tags
  // htmlString = htmlString.replace(/<link[\s\S]*?<\/link>/g, '');
  // // Remove all meta tags
  // htmlString = htmlString.replace(/<meta[\s\S]*?<\/meta>/g, '');
  // // Remove all noscript tags
  // htmlString = htmlString.replace(/<noscript[\s\S]*?<\/noscript>/g, '');

  // // Remove all svg tags
  // htmlString = htmlString.replace(/<svg[\s\S]*?<\/svg>/g, '<svg></svg>');

  // // Remove all attributes (except for id), but keep the element name
  // htmlString = htmlString.replace(
  //   /<([a-zA-Z][a-zA-Z0-9]*)(?:\s+([^>]*))?\s*(\/?)>/g,
  //   (match, tag, attrs, selfClose) => {
  //     if (!attrs) return match;
  //     const idMatch = attrs.match(/\s*id\s*=\s*(['"])([^'"]*)\1/);
  //     // Remove id that is too long (more than 20 characters)
  //     let idAttr = idMatch ? ` id=${idMatch[0].split('=')[1]}` : '';
  //     if (idAttr.length > 20) {
  //       idAttr = '';
  //     }
  //     return `<${tag}${idAttr}${selfClose ? ' /' : ''}>`;
  //   },
  // );
  // // Remove all elements that has no inner text
  // // Remove all elements that has no inner text
  // htmlString = htmlString.replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>(\s*)<\/\1>/g, '');

  console.log('Num of chars after simplification:', markdown.length);
  console.log('htmlString', markdown);

  return markdown;
}
