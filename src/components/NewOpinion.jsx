import { use, useActionState } from "react";
import { OpinionsContext } from "../store/opinions-context";
import Submit from "./Submit";

const INITIAL_STATE = {
  errors: null,
  enteredValues: {
    title: "",
    body: "",
    userName: "",
  },
};

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);

  async function shareOpinionAction(_previousState, formData) {
    const enteredValues = {
      title: String(formData.get("title") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim(),
      userName: String(formData.get("userName") ?? "").trim(),
    };

    const errors = [];

    if (!enteredValues.userName) {
      errors.push("Please provide your name.");
    }

    if (!enteredValues.title) {
      errors.push("Please provide a title.");
    }

    if (enteredValues.body.length < 10 || enteredValues.body.length > 300) {
      errors.push("Your opinion must be between 10 and 300 characters long.");
    }

    if (errors.length > 0) {
      return { errors, enteredValues };
    }

    await addOpinion(enteredValues);

    return INITIAL_STATE;
  }

  const [formState, formAction] = useActionState(
    shareOpinionAction,
    INITIAL_STATE
  );

  return (
    <section id="new-opinion" aria-labelledby="new-opinion-heading">
      <h2 id="new-opinion-heading">Share your opinion!</h2>

      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              required
              autoComplete="name"
              maxLength={100}
              defaultValue={formState.enteredValues.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={100}
              defaultValue={formState.enteredValues.title}
            />
          </p>
        </div>

        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            minLength={10}
            maxLength={300}
            required
            defaultValue={formState.enteredValues.body}
          />
        </p>

        {formState.errors && (
          <ul className="errors" role="alert">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <Submit />
      </form>
    </section>
  );
}
