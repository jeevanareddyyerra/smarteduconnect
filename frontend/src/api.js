export async function postForm(url, data) {
  const formData = new URLSearchParams();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: formData.toString(),
  });

  return await response.json();
}

export async function getJson(url) {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return await response.json();
}

export async function logoutUser() {
  const response = await fetch("/jsp/logoutApi.jsp", {
    method: "GET",
    credentials: "include",
  });

  return await response.json();
}