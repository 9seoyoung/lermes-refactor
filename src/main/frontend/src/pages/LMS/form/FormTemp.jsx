import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"

function FormTemp() {
    return (
        <div className="formTemp">
            <h4>게시글 등록하기</h4>
            <form className="filterList">
                <div className="ftList_L">필터 리스트</div>
                <div className="ftList_R">
                    <div type="button" onClick={"#"} style={{background:"#FCFEFF", padding:"0 4px", borderRadius:"4px", boxShadow:"2px 2px 2px #00000025"}}>
                        + 등록하기
                    </div>
                </div>
            </form>
            <div className="BigListBox">
                <ul className={uiStyle.ListHeader}>
                    <li>#</li>
                    <li>유형</li>
                    <li>제목</li>
                    <li>작성일</li>
                    <li>작성자</li>
                    <li>조회수</li>
                </ul>
                <ListTable></ListTable>
            </div>
        </div>
  )
}

export default FormTemp