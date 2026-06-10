export async function extractError(response: Response): Promise<string> {
  try {
    const body = await response.json();

    if (typeof body?.message === "string") {
      return body.message;
    }

    if (typeof body?.data === "string") {
      return body.data;
    }

    const fieldErrors = Object.values(body ?? {})
      .flat()
      .filter((value): value is string => typeof value === "string");

    if (fieldErrors.length > 0) {
      return fieldErrors.join(" ");
    }
  } catch {}

  return "Произошла ошибка. Попробуйте позже.";
}
