import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function UCSBOrganizationForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "UCSBOrganizationForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {
        <Form.Group className="mb-3">
          <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-orgCode"}
            id="orgCode"
            type="text"
            isInvalid={Boolean(errors.orgCode)}
            {...register("orgCode", {
              required: "Organization Code is required.",
              maxLength: {
                value: 255,
                message: "Max length 255 characters",
              },
            })}
            disabled={true && initialContents}
          />
          <Form.Control.Feedback type="invalid">
            {errors.orgCode?.message}
          </Form.Control.Feedback>
        </Form.Group>
      }

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslationShort">
          Organization Translation Short
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgTranslationShort"}
          id="orgTranslationShort"
          type="text"
          isInvalid={Boolean(errors.orgTranslationShort)}
          {...register("orgTranslationShort", {
            required: "Organization Translation Short is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslationShort?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslation">
          Organization Translation
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgTranslation"}
          id="orgTranslation"
          type="text"
          isInvalid={Boolean(errors.orgTranslation)}
          {...register("orgTranslation", {
            required: "Organization Translation is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters!",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="inactive">Inactive</Form.Label>
        <Form.Check type="checkbox" id="inactive" {...register("inactive")} />
      </Form.Group>

      <Button type="submit">{buttonLabel}</Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBOrganizationForm;
