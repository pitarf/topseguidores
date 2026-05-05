async function test() {
  const url = 'https://tiktok-all-in-one.p.rapidapi.com/user/info?username=rfpita';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '423d6ba5c1msh41135d64d546cd0p162866jsn7ee91736ccde',
      'x-rapidapi-host': 'tiktok-all-in-one.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}

test();
