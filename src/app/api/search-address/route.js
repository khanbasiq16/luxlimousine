import { NextResponse } from "next/server";

const BASE_MAPBOX_URL = "https://api.mapbox.com/search/searchbox/v1/suggest";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const searchText = searchParams.get("q");

  if (!searchText) {
    return NextResponse.json(
      {
        message: "Search text is required",
      },
      { status: 400 }
    );
  }
  
  const url = `${BASE_MAPBOX_URL}?q=${searchText}&language=en&limit=10&session_token=[GENERATED-UUID]&proximity=133.7751,-25.2744&country=AU&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    return NextResponse.json(
      {
        message: "Failed to fetch data from Mapbox",
      },
      { status: response.status }
    );
  }

  const searchresult = await response.json();

  return NextResponse.json({
    message: searchText,
    result: searchresult,
  });
}
