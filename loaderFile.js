export default function myImageLoader({ src, width, height, quality }) {
  return `${src}?width=${width}&height=${height}&quality=${quality || 75}`;
}
