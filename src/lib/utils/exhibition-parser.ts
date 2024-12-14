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
    const oldFile = div.querySelector("p:not(.bn-file-caption)");

    if (oldImg) {
      const newLink = document.createElement("a");
      newLink.href = dataUrl;

      newLink.setAttribute("class", "gallery-img");
      newLink.setAttribute("data-pswp-src", dataUrl); // PhotoSwipe source

      const newImg = document.createElement("img");
      for (const attribute of oldImg.attributes) {
        newImg.setAttribute(attribute.name, attribute.value);
      }
      newImg.src = dataUrl;

      newLink.appendChild(newImg);
      oldImg.replaceWith(newLink);
    }

    if (oldAudio) {
      const newAudio = document.createElement("audio");
      for (const attribute of oldAudio.attributes) {
        newAudio.setAttribute(attribute.name, attribute.value);
      }
      newAudio.src = dataUrl;
      oldAudio.replaceWith(newAudio);
    }

    if (oldFile) {
      const dataName = div.getAttribute("data-name") ?? "File attachment";

      const newFile = document.createElement("a");
      for (const attribute of oldFile.attributes) {
        newFile.setAttribute(attribute.name, attribute.value);
      }
      newFile.href = dataUrl;
      newFile.textContent = dataName;
      newFile.download = dataName;
      newFile.target = "_blank";
      oldFile.replaceWith(newFile);
    }
  });

  return doc.documentElement.outerHTML;
}
