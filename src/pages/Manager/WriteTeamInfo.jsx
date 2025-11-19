import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { BsUpload, BsInstagram, BsFacebook } from "react-icons/bs";
import { BiLogoYoutube } from "react-icons/bi";
import { IoTicket } from "react-icons/io5";
import NavbarLanding from "../../components/Navbar/NavbarLanding";

const WriteTeamInfo = () => {
  const [formData, setFormData] = useState({
    logo: "",
    name: "",
    oneLiner: "",
    description: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      facebook: "",
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("저장된 데이터:", formData);
    // TODO: API 호출하여 데이터 저장
  };

  return (
    <>
      <NavbarLanding />
      {/* Main Content */}
      <ContentWrapper>
        <EditForm>
          {/* Logo Upload */}
          <FieldLabel>단체 대표이미지</FieldLabel>
          <Logo>
            <LogoUploadContainer>
              <LogoUploadLabel htmlFor="logo-upload">
                {formData.logo ? (
                  <UploadedLogo src={formData.logo} alt="업로드된 로고" />
                ) : (
                  <UploadIconWrapper>
                    <BsUpload size={32} color="#333" />
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
            <Desc>*업로드 아이콘을 클릭하여 사진을 첨부해주세요.</Desc>
          </Logo>

          <Flex>
            {/* Group Name */}
            <Left>
              <FormField>
                <FieldLabel>단체명</FieldLabel>
                <InputField
                  type="text"
                  placeholder="단체명을 입력해주세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  style={{ width: "700px" }}
                />
                <Desc>
                  * 필수 항목을 모두 채워주셔야 다음 단계로 이동합니다.
                </Desc>
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
                    onChange={(e) =>
                      handleSocialLinkChange("instagram", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleSocialLinkChange("youtube", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleSocialLinkChange("facebook", e.target.value)
                    }
                  />
                </URLInputWrapper>
              </URLSection>
            </Left>

            <Right>
              {/* One Liner */}
              <FormField>
                <FieldLabel>한줄 소개</FieldLabel>
                <TextAreaField
                  placeholder="한줄 소개를 입력해주세요"
                  value={formData.oneLiner}
                  onChange={(e) =>
                    handleInputChange("oneLiner", e.target.value)
                  }
                  rows={1}
                />
                <Desc>
                  * 필수 항목을 모두 채워주셔야 다음 단계로 이동합니다.
                </Desc>
              </FormField>

              {/* Description */}
              <FormField>
                <FieldLabel>소개글</FieldLabel>
                <TextAreaField
                  placeholder="소개글을 입력해주세요"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  style={{ height: "80px" }}
                />
              </FormField>
            </Right>
          </Flex>

          {/* Save Button */}
          <SaveButton onClick={handleSave}>저장하기</SaveButton>
        </EditForm>
      </ContentWrapper>
    </>
  );
};

export default WriteTeamInfo;

// Styled Components

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 50px 100px;
`;

// Edit Form Styles
const EditForm = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 25px;
  font-weight: 500;
  color: #333;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const LogoUploadContainer = styled.div`
  width: 160px;
  height: 160px;
  border: 1px solid #c5c5c5;
  border-radius: 1000px;
  overflow: hidden;
  cursor: pointer;
`;

const LogoUploadLabel = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const UploadIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadedLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;
const Desc = styled.p`
  color: #d72b2b;
  font-size: 15px;
  font-weight: 300;
`;

const Flex = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
`;
const InputField = styled.input`
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 12px;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 18px;
  font-weight: 300;

  &::placeholder {
    color: #c5c5c5;
  }

  &:focus {
    outline: none;
    border-color: #fc2847;
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 12px;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 18px;
  font-weight: 300;
  resize: none;

  &::placeholder {
    color: #c5c5c5;
  }

  &:focus {
    outline: none;
    border-color: #fc2847;
  }
`;

const URLSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const URLHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const URLTitle = styled.div`
  font-size: 25px;
  font-weight: 500;
  color: #333;
`;

const URLInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InstagramLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: radial-gradient(
      circle at 30% 107%,
      #ffdd55 0%,
      #ff543e 45%,
      #c837ab 90%
    ),
    radial-gradient(circle at 70% 10%, #3771c8 0%, transparent 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const YouTubeLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FacebookLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 1000px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const URLInput = styled.input`
  flex: 1;
  background: white;
  border: 1px solid #c5c5c5;
  border-radius: 12px;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 18px;
  font-weight: 300;

  &::placeholder {
    color: #c5c5c5;
  }

  &:focus {
    outline: none;
    border-color: #fc2847;
  }
`;

const SaveButton = styled.button`
  align-self: flex-end;
  background: #fc2847;
  color: #fffffe;
  font-size: 14px;
  font-weight: 300;
  border: none;
  border-radius: 15px;
  padding: 8px 15px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
