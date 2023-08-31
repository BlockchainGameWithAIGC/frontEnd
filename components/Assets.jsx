import Image from "next/image";
import { useAccount, useContractReads } from "wagmi";
import iCatAbi from "@/lib/abi/catAbi.json";
import eggAbi from "@/lib/abi/eggAbi.json";
import { Loader } from "./Loader";
import Button from "./Button";
import { FeedModal } from "./FeedModal";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";

const Assets = ({ tokenId }) => {
  const [isDead, setIsDead] = useState(false);
  const [owner, setOwner] = useState("");
  const { address } = useAccount();

  const iCatCA = {
    address: process.env.NEXT_PUBLIC_ICAT_CONTRACT_ADDRESS,
    abi: iCatAbi
  }
  
  const { data, isLoading , isSuccess } = useContractReads({
    contracts: [
      {
        ...iCatCA,
        functionName: 'tokenURI',
        args: [tokenId]
      },
      {
        ...iCatCA,
        functionName: 'detail',
        args: [tokenId]
      },
      {
        ...iCatCA,
        functionName: 'calculateHealth',
        args: [tokenId]
      },
      {
        ...iCatCA,
        functionName: 'calculateFeces',
        args: [tokenId]
      },
      {
        ...iCatCA,
        functionName: 'calculateHunger',
        args: [tokenId]
      },
      {
        ...iCatCA,
        functionName: 'calculateIntimacy',
        args: [tokenId]
      }, 
      {
        ...iCatCA,
        functionName: 'ownerOf',
        args: [tokenId]
      }
    ]
  })
  // console.log(data, isSuccess)


  const stage = {
    0: "幼生期",
    1: "成长期",
    2: "成熟期"
  }

  useEffect(() => {
    if (isSuccess) {
      if (data?.[2].result == 0) {
        toast.error("哎呀，由于你的疏忽，这只猫咪已经死亡了，将它埋葬吧！");
        setIsDead(true);
      }
      setOwner(data?.[6].result);
      // console.log('aaa', owner)
    }
  }, [data, isSuccess, owner]);

  return (
    isSuccess ?
    <div className="mx-[204px] my-0 gap-[20px] max-w-[1280px] px-10 pt-[40px] pb-[60px] gap-y-5 flex-col flex">
      <Toaster />
      <div className="grid grid-cols-[320px,1fr] gap-10 relative antialiased">
        <div className="aspect-square bg-white bg-clip-border bg-opacity-100 bg-origin-padding bg-no-repeat bg-auto rounded-xl box-border text-black block overflow-hidden relative antialiased h-[320px]">
          <Image src={"/images/qr.png"} width={320} height={320}/>
        </div>
        <div className="box-border text-black gap-5 gap-y-5 display-flex flex-col h-[180px] m-0 w-[650px] antialiased">
          <div className="flex flex-row justify-start items-center">
            <p className="box-border text-black block font-sans font-extrabold text-3xl h-10 antialiased overflow-hidden">
              iCat #{tokenId} {data?.[1]?.result[0]} {isDead && "(已死亡☠️)"}
            </p>
            {
              // !isDead && 
              owner == address && 
                <EditOutlined />
            }
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono text-black text-sm text-center font-bold leading-6 bg-stripes-fuchsia rounded-lg pt-10">
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              阶段：{stage[data?.[1].result[3]]}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              健康度：{Number(data?.[2].result)}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              饥饿度：{Number(data?.[4].result)}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              排泄物：{Number(data?.[3].result)}
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white drop-shadow-2xl">
              亲密度：{Number(data?.[5].result)}
            </div>
          </div>
        </div>
      </div>
      <div className="border border-solid rounded-xl box-border text-black block font-sans w-[1048px] mt-10 antialiased">
        <div className="grid grid-cols-3 gap-x-20 gap-y-10 font-mono text-white text-sm text-center justify-center items-center font-bold leading-6 bg-stripes-fuchsia rounded-lg">
          {!isDead && <div className="flex flex-col justify-center items-center"> 
            <Button tokenId={tokenId} name={"撸猫"} func={"pet"} />
          </div>}
          {!isDead && <div className="flex flex-col justify-center items-center"> 
            <Button tokenId={tokenId} name={"铲屎"} func={"clearFeces"} />
          </div>}
          {!isDead && <div className="flex flex-col justify-center items-center"> 
            <Button tokenId={tokenId} name={"治疗"} func={"cure"} />
          </div>}
          <div className="flex flex-col justify-center items-center"> 
            <Button tokenId={tokenId} name={"检查"} func={"examCat"} />
          </div>
          {!isDead && <div className="flex flex-col justify-center items-center"> 
            <FeedModal tokenId={tokenId}/>
          </div>}
          <div className="flex flex-col justify-center items-center"> 
            <Button tokenId={tokenId} name={"埋葬"} func={"buryCat"} />
          </div>
        </div>
      </div>
    </div>
    :
    <Loader />
  )
}

export default Assets;