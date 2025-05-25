
# :house: 멋쟁이 사자처럼 클라우드 엔지니어링 스쿨 1기<br>
<div align="center" >
  <img src="https://github.com/user-attachments/assets/bdf93d12-4ca2-413c-af43-0a3d23404b59" alt="멋사" width="500" hight="500">
</div>

## :memo: Final Project(2++bank)

#### 본 프로젝트는 AWS와 온프레미스 환경을 결합한 하이브리드 클라우드 기반의 금융서비스를 개발하는 것을 목표로 합니다. 이 시스템은 데이터 보안과 유연성을 극대화하며, 클라우드의 확장성 및 온프레미스의 안정성을 동시에 제공합니다. 금융기관의 요구사항에 맞춘 데이터 관리 및 처리 기능을 통해 실시간 트랜잭션 분석, 고객맞춤형 서비스 제공, 그리고 신뢰성 있는 데이터 저장을 가능하게 합니다.


<br><br>

## 👨‍💻 조원

- 이지우(PM) : DB, CI/CD, Monitoring<br>
- 손빈(PL) : AWS Infra Engineering<br>
- 신수정 : Application Development, JenkinsCI<br>
- 김영광 : Application Development, ArgoCD<br>
- 김태욱 : AWS S2S VPN (OnPremise-AWS), AWS Solution Architect<br>

<br><br>

## :clipboard: 자료

- 발표 ppt : [2++_최종프로젝트 PPT.pdf](https://github.com/user-attachments/files/17641972/2%2B%2B_.PPT.pdf)
- 팜플렛 : [FinalProject_3_Architecture_Diagram.pdf](https://github.com/user-attachments/files/17612748/FinalProject_3_Architecture_Diagram.pdf)

<br>

## 📌 주요기능
### 1. 메인페이지 & 회원가입
https://github.com/user-attachments/assets/38e96092-b854-4b7b-a289-9e4c1b571d2a

<br>

### 2. 자산관리
https://github.com/user-attachments/assets/2c67c2a0-f929-4669-b1e8-6da3e93791d7

<br>

### 3. 부동산 & 관리자 페이지
https://github.com/user-attachments/assets/f2eb0874-0c72-4293-8588-17a19016094a

<br>

### 4. 모니터링
https://github.com/user-attachments/assets/66dfe113-581b-435c-b93d-b4e34e0ab790

<br>

### 5. 인프라
https://github.com/user-attachments/assets/82c3ea6b-1fc2-4775-af35-a2ea7d09fae2

<br><br>

## 6. VPN - AWS S2S VPN
OnPremise Nerwork <-- **AWS S2S VPN** --> AWS Network Resource
<br>

### 6-1. AWS S2S VPN 구조 소개
****
<img width="1438" alt="image" src="https://github.com/user-attachments/assets/b61438e0-f613-488a-a812-5daa00e11fe5">
IPsec VPN을 구현하여 높은 수준의 보안을 갖춘 VPN 터널링을 구성
<br><br>

### 6-2. S2S VPN의 핵심 기술 - IPsec
****

<img width="1437" alt="image" src="https://github.com/user-attachments/assets/4b3f617b-81a0-4426-ac42-79c6e49cf8a7">
1. VPG에서 데이터를 키 파일을 가지고, 스크램블(암호화)하여 무작위로 섞는다. <br>
2. 무작위로 섞인 데이터 파일을 CGW에 전달한다. <br>
3. 전달받은 CGW에 저장되어 있는 키 파일 (암호화 할 때 썼던 키 파일과 동일)을 가지고 스크램블을 해제(복호화) 한다. 
<br><br>

### 6-3. 흐름 시행착오 및 해결
: VPC Peering -> S2S VPN -> OnPremise
****

<img width="1437" alt="image 8" src="https://github.com/user-attachments/assets/c87610e2-e902-4403-8c4d-a0bf255fc10e">
<img width="1436" alt="image" src="https://github.com/user-attachments/assets/daa3276b-dd7e-40aa-9796-a9ef6989a514">

<br>

