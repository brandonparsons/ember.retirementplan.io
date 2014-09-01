export default function(unixSeconds) {
  return new Date(unixSeconds * 1000);
}
