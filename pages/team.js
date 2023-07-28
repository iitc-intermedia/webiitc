import { Button } from "@/components";
import Text from "@/components/atoms/Text";
import DashboardUserTemplate from "@/components/pagetemplate/DashboardUser";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RiEditLine } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import {
  AiFillCheckCircle,
  AiFillWarning,
  AiOutlineDelete,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FiHome, FiX } from "react-icons/fi";
import Image from "next/image";
import { FilePond } from "filepond";
import Input from "@/components/atoms/Input";
import FileInput from "@/components/atoms/FilePond";
import GetDetailTeam from "@/api/team/GetDetail";
import GetDetailCompetitionsApi from "@/api/homepage/GetDetailCompetitionApi";
import { BiCheckCircle, BiUserCircle } from "react-icons/bi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import EditTeamApi from "@/api/team/Edit";
import Alert from "@/components/atoms/Alert";
import DeleteTeamApi from "@/api/team/Delete";
import KickApi from "@/api/team/Kick";
import { BsFileEarmarkCheck } from "react-icons/bs";
import Link from "next/link";
const userMail = Cookies.get("email");
console.log(userMail);

const TeamPage = () => {
  const router = useRouter();
  const [isPaidOf, setIsPaidOf] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [competition, setCompetition] = useState({});
  const [isHitCompetition, setIsHitCompetition] = useState(true);
  const [isHitTeam, setIsHitTeam] = useState(true);
  const [team, setTeam] = useState({});
  const [copied, setCopied] = useState(false);
  const [isCsr, setIsCsr] = useState(false);

  // edit
  const [teamName, setTeamName] = useState("");
  const [image, setImage] = useState(null);
  const [isHitEdit, setIsHitEdit] = useState(false);

  const [isSucces, setIsSucces] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [Message, setMessage] = useState("");

  const teamId = router.query.i;
  const cSlug = router.query?.sl;

  // delete
  const [isDelete, setIsDelete] = useState(false);
  const [isHitDelete, setIsHitDelete] = useState(false);

  // kick
  const [isKick, setIsKick] = useState(false);
  const [isHitKick, setIsHitKick] = useState(false);
  const [kickName, setKickName] = useState("");
  const [kicId, setKicId] = useState("");

  //submit
  const [teamTitle, setTeamTitle] = useState("-");
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    setIsCsr(true);
    if (teamId) {
      getDetailTeam();
    }

    if (cSlug) {
      setIsHitCompetition(true);
      GetDetailCompetitionsApi({ slug: cSlug })
        .then((res) => {
          setCompetition(res.data?.competition);
          setIsHitCompetition(false);
        })
        .catch((err) => console.log(err));
    }
  }, [router]);
  const getDetailTeam = () => {
    setIsHitTeam(true);
    GetDetailTeam({ id: teamId })
      .then((res) => {
        console.log(res);
        setTeam(res.data?.team);
        setIsHitTeam(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEditTeam = (e) => {
    e.preventDefault();
    setIsHitEdit(true);
    EditTeamApi({ name: teamName, avatar: image, teamId, title: teamTitle })
      .then((res) => {
        console.log(res);
        if (res.status == 1) {
          setIsHitEdit(false);
          setIsEditing(false);
          setIsSucces(true);
          setMessage(res.message);
          getDetailTeam();
          setTimeout(() => {
            setIsSucces(false);
          }, 2000);
        } else {
          setIsHitEdit(false);
          setIsEditing(false);
          setIsWrong(true);
          setMessage(res.message);
          setTimeout(() => {
            setIsWrong(false);
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };
  const handlePopUpEdit = () => {
    setIsEditing(true);
    setTeamName(team.name);
  };
  const handleDeleteTeam = () => {
    setIsHitDelete(true);
    DeleteTeamApi({ teamId }).then((res) => {
      if (res.status == 1) {
        setIsSucces(true);
        setIsHitDelete(true);
        setMessage(res.message);
        setIsDelete(false);
        setTimeout(() => {
          setIsSucces(false);
        }, 2000);
        setIsHitTeam(true);
        router.push("/dashboard");
      } else {
        setIsHitDelete(false);
        setIsWrong(true);
        setIsDelete(false);
        setMessage(res.message);
      }
    });
  };

  const handleKick = () => {
    setIsHitKick(true);
    KickApi({ teamId, memberId: kicId }).then((res) => {
      if (res.status == 1) {
        setIsSucces(true);
        setIsHitKick(true);
        setMessage(res.message);
        setIsKick(false);
        setIsHitTeam(true);
        getDetailTeam();
        setTimeout(() => {
          setIsSucces(false);
          setIsHitTeam(false);
        }, 2000);
      } else {
        setIsHitKick(false);
        setIsWrong(true);
        setIsKick(false);
        setMessage(res.message);
      }
    });
  };
  const openKick = ({ name, id }) => {
    setKickName(name);
    setIsKick(true);
    setKicId(id);
  };
  const handleOpenSubmit = () => {
    if (team.isActive == "VALID") {
      setIsPaidOf(true);
      if (team.title) {
        setTeamTitle(team.title);
      }
    } else {
      setIsAlert(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsHitEdit(true);
    EditTeamApi({ teamId, submission, title: teamTitle, name: team.name })
      .then((res) => {
        console.log(res);
        if (res.status == 1) {
          setIsHitEdit(false);
          setIsPaidOf(false);
          setIsSucces(true);
          setMessage(res.message);
          getDetailTeam();
          setTimeout(() => {
            setIsSucces(false);
          }, 2000);
        } else {
          setIsHitEdit(false);
          setIsPaidOf(false);
          setIsWrong(true);
          setMessage(res.message);
          setTimeout(() => {
            setIsWrong(false);
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };
  const buttonBayar = () => {
    return team.isActive == null || team.isActive == "INVALID";
  };
  return (
    <>
      {/* submit */}
      <PopUp
        isModal={isPaidOf}
        onClose={() => {
          setIsPaidOf(false);
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-slate-200 rounded p-2 text-xl font-bold">
              <BsFileEarmarkCheck />
            </div>
            <Text
              size={"smalltitle"}
              additionals={"my-3"}
              color={"text-black"}
              weight={"bold"}
            >
              Submit Project
            </Text>
          </div>
          <Input
            required
            placeholder="Judul Project"
            value={teamTitle}
            onChange={(e) => setTeamTitle(e.target.value)}
          />

          <input
            className="block w-full mt-4 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
            id="small_size"
            accept=".zip"
            type="file"
            onChange={(e) => setSubmission(e.target.files[0])}
          ></input>
          <label
            className="block mt-1 text-sm font-medium text-gray-900 "
            htmlFor="small_size"
          >
            File Project .zip
          </label>
          <div className="flex space-x-4 w-full mt-4">
            <Button isSquare additionals={"w-full"} color={"oren"}>
              {isHitEdit ? (
                <AiOutlineLoading3Quarters className="text-xl mx-auto text-white animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </PopUp>
      {/* kick */}
      <PopUp isModal={isKick} onClose={() => setIsKick(false)}>
        <Text
          color={"black"}
          size={"description"}
          additionals={"text-center w-10/12"}
        >
          Anda yakin akan mengeluarkan anggota {kickName}?
        </Text>
        <Button
          onClick={() => handleKick()}
          isSquare
          additionals={"w-full mt-3"}
          color={"dark"}
        >
          {isHitKick ? (
            <AiOutlineLoading3Quarters className="text-xl mx-auto text-white animate-spin" />
          ) : (
            "Keluarkan"
          )}
        </Button>
      </PopUp>
      {/* delete */}
      <PopUp isModal={isDelete} onClose={() => setIsDelete(false)}>
        <Text color={"black"} size={"description"} additionals={"text-center"}>
          Anda yakin ingin menghapus?
        </Text>
        <Button
          onClick={() => handleDeleteTeam()}
          isSquare
          additionals={"w-full mt-3"}
          color={"dark"}
        >
          {isHitDelete ? (
            <AiOutlineLoading3Quarters className="text-xl mx-auto text-white animate-spin" />
          ) : (
            "Hapus"
          )}
        </Button>
      </PopUp>
      {/* payment */}
      <PopUp
        isModal={isAlert}
        onClose={() => {
          setIsAlert(false);
        }}
      >
        <div className="w-full flex flex-col items-center">
          <Image
            src={"/images/Logo iitcom.png"}
            alt="logo iitc"
            width={1080}
            height={1080}
            className="w-20"
          />
          <Text
            size={"smalltitle"}
            additionals={"my-3"}
            color={"text-black"}
            weight={"bold"}
          >
            {getTitlePopUpMessage(team?.isActive)}
          </Text>
          <Text additionals={"text-center"}>
            {getPopUpMessage(team?.isActive)}
          </Text>
          <div className="flex space-x-4 w-full mt-4">
            {buttonBayar() && (
              <Link
                href={`/payment?i=${team.id}&sl=${cSlug}`}
                className="w-full"
              >
                <Button isSquare additionals={"w-full"} color={"oren"}>
                  Bayar Sekarang
                </Button>
              </Link>
            )}
          </div>
        </div>
      </PopUp>
      {/* edit */}
      <PopUp onClose={() => setIsEditing(false)} isModal={isEditing}>
        <form
          onSubmit={handleEditTeam}
          className="py-4 flex flex-col space-y-4"
        >
          <Text size={"smalltitle"}>Edit Team</Text>
          <Input
            placeholder="Nama Tim"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <FileInput
            placeholder="Pilih Avatar Team"
            image={image}
            setImage={setImage}
          />
          <Button additionals={"w-full"} isSquare>
            {isHitEdit ? (
              <AiOutlineLoading3Quarters className="text-xl mx-auto text-white animate-spin" />
            ) : (
              "Edit"
            )}
          </Button>
        </form>
      </PopUp>
      <div className="overflow-hidden">
        <DashboardUserTemplate>
          <Alert onClose={() => setIsSucces(false)} isOpen={isSucces}>
            <AiFillCheckCircle className="text-green-400 text-xl" />
            <p>{Message}</p>
          </Alert>
          <Alert onClose={() => setIsWrong(false)} isOpen={isWrong}>
            <AiFillWarning className="text-red text-xl" />
            <p>{Message}</p>
          </Alert>
          <ul className="flex w-11/12 mx-auto space-x-3 items-center">
            <li>
              <Link href={"/dashboard"}>
                <FiHome className="text-blue-400" />
              </Link>
            </li>
            <li className="text-black/70">&gt;</li>
            <li className="text-black/70">Team</li>
            <li className="text-black/70">&gt;</li>
            <li className="text-oren">{team.name}</li>
          </ul>
          {isHitCompetition ? (
            <div className="w-11/12 mx-auto h-96 rounded-md animate-pulse bg-slate-200"></div>
          ) : (
            <div className="flex gap-6 w-11/12 border-b pb-8 mx-auto items-start justify-between relative md:flex-row flex-col">
              <img
                src={competition?.cover}
                width={1080}
                height={1080}
                alt="Gambar Lomba"
                className="md:w-4/12 w-full rounded-md md:sticky top-3"
              />
              <div className="md:w-8/12 w-full relative">
                {StatusPayment(team.isActive)}
                <div>
                  <p className="text-sm text-black/60">Lomba yang diikuti</p>
                  <Text color={"text-black font-bold"} size={"title"}>
                    {competition?.name}
                  </Text>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-black/60">Deskripsi</p>
                  <Text color={"text-black font-bold"} size={"description"}>
                    {competition?.description}
                  </Text>
                </div>
                <div className="mt-3 flex gap-6">
                  <div>
                    <p className="text-sm text-black/60">Deadline</p>
                    <Text color={"text-black font-bold"} size={"description"}>
                      {competition?.deadline} Hari
                    </Text>
                  </div>

                  <div>
                    <p className="text-sm text-black/60">Harga</p>
                    <Text color={"text-black font-bold"} size={"description"}>
                      Rp.{" "}
                      {competition?.competitionPrice.toLocaleString("id-ID")}
                    </Text>
                  </div>
                  <ul className="grid grid-rows-2">
                    <p className="text-sm text-black/60">Stacks</p>
                    {competition?.techStacks.map((item, idx) => (
                      <Text
                        key={idx}
                        color={"text-black font-bold"}
                        size={"description"}
                      >
                        {item}
                      </Text>
                    ))}
                  </ul>
                </div>
                {isCsr && userMail == team?.leader?.email && (
                  <Button
                    onClick={() => handleOpenSubmit()}
                    isSquare
                    color={"oren"}
                    additionals={"w-full mt-6"}
                  >
                    {team.isSubmit ? "Edit" : "Submit"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* team */}
          {isHitTeam ? (
            <AiOutlineLoading3Quarters className="text-xl mx-auto text-black/70 animate-spin" />
          ) : (
            <div className="w-11/12 mx-auto mt-8">
              <div className="flex lg:flex-row flex-col w-full lg:space-x-6 space-y-3 lg:space-y-0 relative justify-start items-start lg:items-center pb-8 border-b">
                <CopyToClipboard
                  text={team.code}
                  onCopy={() => setCopied(true)}
                >
                  <Button
                    isSquare
                    color={"green"}
                    additionals={
                      "flex items-center space-x-2 lg:absolute lg:right-0"
                    }
                  >
                    {copied ? (
                      <>
                        <BiCheckCircle className="text-xl" />
                        <p>Di Salin</p>
                      </>
                    ) : (
                      <>
                        <IoCopyOutline className="text-xl" />
                        <p>#{team.code}</p>
                      </>
                    )}
                  </Button>
                </CopyToClipboard>
                {team.avatar ? (
                  <img
                    src={team.avatar}
                    alt="Buaya"
                    width={1080}
                    height={1080}
                    className="lg:w-36 h-36 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="lg:w-36 h-36 flex justify-center items-center w-full rounded-md bg-slate-200 animate-pulse">
                    {getTwoChar(team.name)}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <Text size={"title"} color={"text-black"}>
                      {team.name}
                    </Text>
                    <Text>
                      {team.members?.length + 1}/{competition.maxMembers}{" "}
                      Anggota
                    </Text>

                    {isCsr && userMail == team?.leader?.email && (
                      <div className="mt-3 flex space-x-1">
                        <Button
                          color={"oren"}
                          size={"sm"}
                          isSquare
                          onClick={() => handlePopUpEdit()}
                          additionals={"flex items-center space-x-1"}
                        >
                          <p>Edit</p>
                          <RiEditLine />
                        </Button>
                        <Button
                          color={"dark"}
                          size={"sm"}
                          isSquare
                          additionals={`flex items-center space-x-1 ${
                            team.isActive == "VALID" &&
                            team.isSubmit &&
                            "hidden"
                          }`}
                          onClick={() => setIsDelete(true)}
                        >
                          <p>Hapus</p>
                          <AiOutlineDelete />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <ul className="mt-8">
                {team?.members?.length > 0 ? (
                  team?.members?.map((item, idx) => (
                    <MemberItem
                      key={idx}
                      name={item.name}
                      email={item.email}
                      leaderEmail={team.leader?.email}
                      onKick={() => openKick({ name: item.name, id: item.id })}
                      avatar={item?.participant?.avatar}
                    />
                  ))
                ) : (
                  <NoMembers />
                )}
              </ul>
            </div>
          )}
        </DashboardUserTemplate>
      </div>
    </>
  );
};

export default TeamPage;

const PopUp = ({ onClose, isModal, children }) => {
  return (
    <div
      className={`${
        isModal ? "visible opacity-100" : "invisible opacity-0"
      } transition-all duration-300 bg-dark/10 backdrop-blur-md w-full fixed h-screen z-50 flex justify-center items-center`}
    >
      <div className="w-full max-w-[450px] p-4 bg-white rounded-md flex flex-col justify-start items-center relative">
        <button
          onClick={onClose}
          className="bg-red/10 text-red rounded-full p-1 absolute top-3 right-3"
        >
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
};

export const StatusPayment = (status) => {
  switch (status) {
    case null:
      return (
        <div className="absolute top-0 right-0 bg-red/20 px-2 py-1 rounded-full">
          <Text additionals={"text-red"} size={"small"}>
            Belum Bayar
          </Text>
        </div>
      );
    case "INVALID":
      return (
        <div className="absolute top-0 right-0 bg-red/20 px-2 py-1 rounded-full">
          <Text additionals={"text-red"} size={"small"}>
            Gagal Bayar
          </Text>
        </div>
      );
    case "PENDING":
      return (
        <div className="absolute top-0 right-0 bg-yellow-400/20 px-2 py-1 rounded-full">
          <Text additionals={"text-yellow-400"} size={"small"}>
            Di Proses
          </Text>
        </div>
      );
    case "VALID":
      return (
        <div className="absolute top-0 right-0 bg-green-400/20 px-2 py-1 rounded-full">
          <Text additionals={"text-green-400"} size={"small"}>
            Sudah Bayar
          </Text>
        </div>
      );
  }
};

const MemberItem = ({ avatar, name, email, leaderEmail, onKick }) => {
  return (
    <li className="flex justify-between items-center lg:flex-row flex-col">
      <div className="flex items-start lg:items-center justify-start lg:space-x-3 space-y-2 lg:space-y-0 lg:flex-row flex-col w-full">
        {avatar ? (
          <img
            src={avatar}
            alt="Buaya"
            width={1080}
            height={1080}
            className="lg:w-24 w-full h-24 rounded-md object-cover"
          />
        ) : (
          <div className="lg:w-24 w-full h-24 rounded-md bg-slate-200 animate-pulse flex justify-center items-center">
            {getTwoChar(name)}
          </div>
        )}
        <div>
          <Text size={"smalltitle"}>{name}</Text>
          <Text>{email}</Text>
        </div>
      </div>
      {leaderEmail == userMail && (
        <Button
          additionals={"max-lg:w-full max-lg:mt-3"}
          onClick={onKick}
          color={"red"}
        >
          Kick
        </Button>
      )}
    </li>
  );
};

const NoMembers = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Text>Belum memiliki anggota</Text>
    </div>
  );
};

const getPopUpMessage = (status) => {
  switch (status) {
    case null:
      return "Lengkapi pembayaran terlebih dahulu sebelum melanjutkan ke step selanjutnya. Silahkan klik tombol bayar sekarang untuk melakukan pembayaran & konfirmasi pembayaran!";
    case "PENDING":
      return "Pembayaran sedang diperiksa oleh admin";
    case "INVALID":
      return "Pembayaran Kamu ditolak, mohon untuk mengirimkan nota yang benar!";
  }
};

const getTitlePopUpMessage = (status) => {
  switch (status) {
    case null:
      return "Lengkapi pembayaran";
    case "PENDING":
      return "Harap menunggu";
    case "INVALID":
      return "Pembayaran ditolak";
  }
};

export const getTwoChar = (value) => {
  return value?.substring(0, 2);
};
