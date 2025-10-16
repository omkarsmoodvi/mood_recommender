export default async function handler(req, res) {
  const { q } = req.query;
  const GOOGLE_API_KEY = "AIzaSyBCaChTEegS7AHyhWnsAcl_BfuN0McHkto";
  const CSE_ID = "d7611fd2d91b84b8d";

  if (!q) {
    res.status(400).json({ error: 'Missing query parameter' });
    return;
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(q)}`;
    console.log('Calling Google API:', url); // Debug log
    const response = await fetch(url);
    const data = await response.json();
    console.log('Google API response:', data); // Debug log
    res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error); // Debug log
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
