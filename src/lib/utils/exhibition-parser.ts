/**
 * Necessary due to a Blocknote editor bug, where itdoesn't properly parse images and audio components.
 */
export function convertToValidHTML(htmlString: string | undefined): string {
  if (!htmlString) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const divs = doc.querySelectorAll("div[data-file-block]"); // look at data blocks only
  divs.forEach((div) => {
    const dataUrl = div.getAttribute("data-url");
    if (!dataUrl) return;

    const oldImg = div.querySelector("img");
    const oldAudio = div.querySelector("audio");

    if (oldImg) {
      const newImg = document.createElement("img");
      for (const attribute of oldImg.attributes) {
        newImg.setAttribute(attribute.name, attribute.value);
      }
      newImg.src = dataUrl;
      oldImg.replaceWith(newImg);
    }

    if (oldAudio) {
      const newAudio = document.createElement("audio");
      for (const attribute of oldAudio.attributes) {
        newAudio.setAttribute(attribute.name, attribute.value);
      }
      newAudio.src = dataUrl;
      oldAudio.replaceWith(newAudio);
    }
  });

  return doc.documentElement.outerHTML;
}
