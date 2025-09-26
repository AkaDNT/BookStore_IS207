import ListBooks from "../components/layout/ListBooks";
import Slider from "../components/layout/Slider";
import KeyHighlights from "../components/layout/KeyHighlights";

export default async function Home() {
  const res = await fetch(`${process.env.API_URL}/books`);
  const books = await res.json();
  const sortedBooks = [...books].sort((a, b) => {
    const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
    const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
    return dateB - dateA;
  });
  return (
    <div>
      <Slider></Slider>
      <KeyHighlights></KeyHighlights>
      <ListBooks books={books} title="Selected for you"></ListBooks>
      <ListBooks books={sortedBooks} title="Recently update"></ListBooks>
    </div>
  );
}
