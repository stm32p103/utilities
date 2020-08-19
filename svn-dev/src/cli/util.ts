export function getInnerHtml( element: Element, tagName: string ) {
  return element.querySelector( tagName ).innerHTML;
}
