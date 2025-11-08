import React, { useState } from 'react'
import styled from 'styled-components'
import { AiOutlineClose } from 'react-icons/ai'
import { BsUpload, BsInstagram, BsFacebook } from 'react-icons/bs'
import { BiLogoYoutube } from 'react-icons/bi'
import { IoTicket } from 'react-icons/io5'

import logoPlaceholder from '../../assets/homemanager/myteam.png' // 기본 로고 이미지

const EditTeamInfo = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    logo: '',
    name: '멋쟁이 연극회',
    oneLiner: '멋쟁이 연극회입니다.',
    description: '이런 멋쟁이연극회 좋아할래...',
    socialLinks: {
      instagram: '',
      youtube: '',
      facebook: ''
    }
  })


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }


  const handleSave = () => {
    console.log('저장된 데이터:', formData)
    // TODO: API 호출하여 데이터 저장
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <ModalHeader>
          <ModalTitle>단체 소개 수정하기</ModalTitle>
          <CloseButton onClick={onClose}>
            <AiOutlineClose size={24} />
          </CloseButton>
        </ModalHeader>

        {/* Main Content */}
        <ContentWrapper>
          {/* Left: Mobile Preview */}
          <MobilePreview>
            <MobileContainer>
              {/* Mobile Header */}
              <MobileHeader>
                <LogoImage src="/tikitta_logo.ico" alt="티키타 로고" />
                <GroupNameHeader>{formData.name}</GroupNameHeader>
                <TicketIcon>
                  <IoTicket size={24} color="#FC2847" />
                </TicketIcon>
              </MobileHeader>

              {/* Mobile Content */}
              <MobileContent>
                {/* Logo */}
                <PreviewLogoContainer>
                  {formData.logo ? (
                    <PreviewLogo src={formData.logo} alt="단체 로고" />
                  ) : (
                    <PreviewLogo src={logoPlaceholder} alt="기본 로고" />
                  )}
                </PreviewLogoContainer>

                {/* Group Name */}
                <PreviewGroupName>{formData.name}</PreviewGroupName>

                {/* SNS Icons */}
                <SocialIconsPreview>
                  {formData.socialLinks.instagram && (
                    <BsInstagram size={22} color="#FC2847" />
                  )}
                  {formData.socialLinks.facebook && (
                    <BsFacebook size={22} color="#FC2847" />
                  )}
                  {formData.socialLinks.youtube && (
                    <BiLogoYoutube size={22} color="#FC2847" />
                  )}
                </SocialIconsPreview>

                {/* One Liner */}
                <InfoSection>
                  <SectionTitle>한줄 소개</SectionTitle>
                  <SectionContent>{formData.oneLiner}</SectionContent>
                </InfoSection>

                {/* Description */}
                <InfoSection>
                  <SectionTitle>소개글</SectionTitle>
                  <DescriptionContent>{formData.description}</DescriptionContent>
                </InfoSection>
              </MobileContent>

              {/* Mobile Footer */}
              <MobileFooter>예매하기</MobileFooter>
            </MobileContainer>
          </MobilePreview>

          {/* Right: Edit Form */}
          <EditForm>
            {/* Logo Upload */}
            <LogoUploadContainer>
              <LogoUploadLabel htmlFor="logo-upload">
                {formData.logo ? (
                  <UploadedLogo src={formData.logo} alt="업로드된 로고" />
                ) : (
                  <UploadIconWrapper>
                    <BsUpload size={24} color="#C5C5C5" />
                  </UploadIconWrapper>
                )}
              </LogoUploadLabel>
              <HiddenInput
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </LogoUploadContainer>

            {/* Group Name */}
            <FormField>
              <FieldLabel>단체명</FieldLabel>
              <InputField
                type="text"
                placeholder="멋쟁이 연극회"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{ width: '150px' }}
              />
            </FormField>

            {/* One Liner */}
            <FormField>
              <FieldLabel>한줄 소개</FieldLabel>
              <TextAreaField
                placeholder="한줄 소개를 입력하세요"
                value={formData.oneLiner}
                onChange={(e) => handleInputChange('oneLiner', e.target.value)}
                rows={1}
              />
            </FormField>

            {/* Description */}
            <FormField>
              <FieldLabel>소개글</FieldLabel>
              <TextAreaField
                placeholder="소개글을 입력하세요"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                style={{ height: '80px' }}
              />
            </FormField>

            {/* URL Section */}
            <URLSection>
              <URLHeader>
                <URLTitle>URL</URLTitle>
              </URLHeader>

              {/* Instagram */}
              <URLInputWrapper>
                <InstagramLogo>
                  <BsInstagram size={20} color="white" />
                </InstagramLogo>
                <URLInput
                  type="url"
                  placeholder="인스타 링크"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                />
              </URLInputWrapper>

              {/* YouTube */}
              <URLInputWrapper>
                <YouTubeLogo>
                  <BiLogoYoutube size={24} color="#FF0000" />
                </YouTubeLogo>
                <URLInput
                  type="url"
                  placeholder="유튜브 링크"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                />
              </URLInputWrapper>

              {/* Facebook */}
              <URLInputWrapper>
                <FacebookLogo>
                  <BsFacebook size={20} color="#0966FF" />
                </FacebookLogo>
                <URLInput
                  type="url"
                  placeholder="페이스북 링크"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                />
              </URLInputWrapper>
            </URLSection>

            {/* Save Button */}
            <SaveButton onClick={handleSave}>저장하기</SaveButton>
          </EditForm>
        </ContentWrapper>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default EditTeamInfo

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
  padding: 20px 30px;
  max-width: 85vw;
  max-height: 85vh;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #333;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;

  &:hover {
    opacity: 0.7;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  gap: 30px;
`

// Mobile Preview Styles
const MobilePreview = styled.div`
  flex-shrink: 0;
`

const MobileContainer = styled.div`
  width: 280px;
  height: 600px;
  background: white;
  border-radius: 15px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const MobileHeader = styled.div`
  height: 50px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  gap: 10px;
`

const LogoImage = styled.img`
  height: 30px;
  object-fit: contain;
`

const GroupNameHeader = styled.div`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  text-align: center;
`

const TicketIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const MobileContent = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
`

const PreviewLogoContainer = styled.div`
  width: 100px;
  aspect-ratio: 1/1;
  border: 1px solid #FC2847;
  border-radius: 1000px;
  overflow: hidden;
  align-self: center;
`

const PreviewLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const PreviewGroupName = styled.div`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #333;
`

const SocialIconsPreview = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`

const SectionContent = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #333;
  line-height: 18px;
`

const DescriptionContent = styled(SectionContent)`
  height: 120px;
  overflow-y: auto;
`

const MobileFooter = styled.div`
  background: #FC2847;
  color: white;
  font-size: 14px;
  font-weight: 500;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin: 8px;
`

// Edit Form Styles
const EditForm = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FieldLabel = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`

const LogoUploadContainer = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid #C5C5C5;
  border-radius: 1000px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const LogoUploadLabel = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const UploadIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const UploadedLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HiddenInput = styled.input`
  display: none;
`

const InputField = styled.input`
  background: white;
  border: 1px solid #C5C5C5;
  border-radius: 12px;
  padding: 8px 15px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 300;

  &::placeholder {
    color: #C5C5C5;
  }

  &:focus {
    outline: none;
    border-color: #FC2847;
  }
`

const TextAreaField = styled.textarea`
  width: 100%;
  background: white;
  border: 1px solid #C5C5C5;
  border-radius: 12px;
  padding: 8px 15px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 300;
  resize: none;

  &::placeholder {
    color: #C5C5C5;
  }

  &:focus {
    outline: none;
    border-color: #FC2847;
  }
`

const URLSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const URLHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const URLTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`

const URLInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const InstagramLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: radial-gradient(circle at 30% 107%, #FFDD55 0%, #FF543E 45%, #C837AB 90%),
              radial-gradient(circle at 70% 10%, #3771C8 0%, transparent 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const YouTubeLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const FacebookLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 1000px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const URLInput = styled.input`
  flex: 1;
  background: white;
  border: 1px solid #C5C5C5;
  border-radius: 12px;
  padding: 8px 15px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 300;

  &::placeholder {
    color: #C5C5C5;
  }

  &:focus {
    outline: none;
    border-color: #FC2847;
  }
`

const SaveButton = styled.button`
  align-self: flex-end;
  background: #FC2847;
  color: #FFFFFE;
  font-size: 14px;
  font-weight: 300;
  border: none;
  border-radius: 15px;
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`
