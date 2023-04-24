/** This proxy serverless function is currently required for some legacy dynatrace environment apis
 *  which have not be migrated to Settings2.0. It should only be used when native SDKs are not
 *  available. */
export default async function (payload: { url: string; requestInit: RequestInit }) {
  const { url, requestInit } = payload;
  const apiResponse = await fetch(url, requestInit);
  try {
    const data = await apiResponse.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { error };
  }
}
