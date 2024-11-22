export async function signUp({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          c_password: password,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error signing up", error);
    return null;
  }
}
