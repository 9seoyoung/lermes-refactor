// 페이지찾기 - 게시글 등록
import React from 'react'
import { FileList } from '../../../components/ui/UiComp'

export const ArticlePost = ({formId, handleChange, formData, files, setFiles, commentToggle, setCommentToggle}) => {
  return (
    <>
    <div className='formHeader'>
              <div className='inputSet'>
                <label className='formLabel' htmlFor={`${formId}_title`}>제목</label>
                <input id={`${formId}_title`}
                  className='formInput' 
                  name='title' 
                  placeholder='제목을 입력하세요.' 
                  value={formData.title} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* 본문 */}
            <textarea                 
                id={`${formId}_content`}
                name="content"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.content}
                onChange={handleChange}>
                  required
            </textarea>
            <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <FileList files={files} setFiles={setFiles} />
            </div>
    </>
  )
}

