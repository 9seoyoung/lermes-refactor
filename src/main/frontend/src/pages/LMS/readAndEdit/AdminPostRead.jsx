// 페이지찾기 - 게시판
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useAccount } from "../../../auth/AuthContext";
import FilterList from "../../../components/ui/FilterList";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { StudySched_Tb } from "../../../components/module/TableAll";
import InterviewEditPost from "../form/InterviewEditPost";
import { SchedRead } from "./SchedRead";
import InterviewMemoRead from "./InterviewMemoRead";
import InterviewRead from "./InterviewRead";

export default function AdminPostRead({whereTogo}){
    


    return (
        <div className="boardPage">
            <h2>게시물 관리</h2>
            <div className="formAreaRow">
                <InterviewEditPost whereTogo={whereTogo}></InterviewEditPost>
                {/* <InterviewRead></InterviewRead> */}
            </div>
        </div>
    );
}
