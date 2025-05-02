import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";

export default function MenuItemReviewsCreatePage({ storybook = false }) {
  const objectToAxiosParams = (menuitemreview) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
      itemID: menuitemreview.itemId,
      reviewerEmail: menuitemreview.reviewerEmail,
      stars: menuitemreview.stars,
      reviewDate: menuitemreview.dateReviewed,
      comments: menuitemreview.comments,
    },
  });

  const onSuccess = (menuitemreview) => {
    toast(
      `New restaurant Created - id: ${menuitemreview.id} comments: ${menuitemreview.comments}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreviews/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create new Menu Item Review</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}

