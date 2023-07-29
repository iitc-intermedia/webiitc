import GetToken from "@/api/utils/GetToken";
import axios from "axios";
import UrlTeam from "../routes/team";

const DeleteTeamApi = async ({ teamId }) => {
  try {
    const res = await axios({
      method: "DELETE",
      baseURL: `${UrlTeam}/${teamId}`,
      headers: {
        Authorization: GetToken({ isAdmin: false }),
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export default DeleteTeamApi;
