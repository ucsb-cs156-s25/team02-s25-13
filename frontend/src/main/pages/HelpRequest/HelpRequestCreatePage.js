import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { ExternalsPlugin } from "webpack";

export default function HelpRequestCreatePage({ storybook = false }) {
  const objectToAxiosParams = (helpRequest) => ({
    url: "/api/helprequest/post",
    method: "POST",
    params: {
      id: helpRequest.id,
      requesterEmail: helpRequest.requesterEmail,
      teamId: helpRequest.teamId,
      requestTime: helpRequest.requestTime,
      tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
      solved: helpRequest.solved,
      explanation: helpRequest.explanation,
    },
  });

  const onSuccess = (helpRequest) => {
    toast(
      `New helpRequest Created - id: ${helpRequest.id} requester email: ${helpRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/helprequest/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New HelpRequest</h1>

        <HelpRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
