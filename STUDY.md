# Book Shop 프로젝트 학습 정리

> 이번 세션에서 작성한 코드를 기반으로 핵심 문법과 패턴을 정리했습니다.
> 각 개념을 읽고, 직접 새 파일에 처음부터 다시 작성해보는 것이 가장 효과적입니다.

---

## 목차

### Backend (Spring Boot + MyBatis)
1. [Lombok 어노테이션](#1-lombok-어노테이션)
2. [DTO 설계 - Request / Response](#2-dto-설계---request--response)
3. [MyBatis Mapper 인터페이스](#3-mybatis-mapper-인터페이스)
4. [MyBatis XML - ResultMap & 동적 쿼리](#4-mybatis-xml---resultmap--동적-쿼리)
5. [Service - 인터페이스 + 구현체 분리](#5-service---인터페이스--구현체-분리)
6. [Controller - REST API 설계](#6-controller---rest-api-설계)

### Frontend (React + Axios)
7. [API 모듈 작성 패턴](#7-api-모듈-작성-패턴)
8. [공통 컴포넌트 설계](#8-공통-컴포넌트-설계)
9. [useState / useEffect / useCallback](#9-usestate--useeffect--usecallback)
10. [검색 필터 + 페이지네이션 패턴](#10-검색-필터--페이지네이션-패턴)
11. [Optimistic UI Update (즉시 갱신)](#11-optimistic-ui-update-즉시-갱신)
12. [모달 패턴](#12-모달-패턴)
13. [아코디언 패턴](#13-아코디언-패턴)
14. [이벤트 버블링 방지](#14-이벤트-버블링-방지)

---

## Backend

---

### 1. Lombok 어노테이션

> Lombok은 반복적인 Java 코드(getter, setter, 생성자 등)를 어노테이션으로 자동 생성해줍니다.

```java
// 자주 쓰는 어노테이션 조합
@Getter           // 모든 필드에 getXxx() 메서드 생성
@Setter           // 모든 필드에 setXxx() 메서드 생성
@ToString         // toString() 자동 생성
@AllArgsConstructor   // 모든 필드를 받는 생성자 생성
@NoArgsConstructor    // 기본 생성자(인자 없음) 생성
@Builder          // 빌더 패턴 사용 가능 → MyClass.builder().field(value).build()

// Service, Controller에서 자주 쓰는 조합
@RequiredArgsConstructor  // final 필드만 받는 생성자 생성 → DI(의존성 주입)에 활용
@Slf4j            // log 변수 자동 생성 → log.info("메시지: {}", 변수)
```

**핵심 포인트:**
- `@RequiredArgsConstructor` + `private final XxxService service` → `@Autowired` 없이 생성자 주입
- `@Builder`를 쓰면 객체 생성 시 필드 순서 상관없이 명시적으로 작성 가능
- `@Slf4j` → `log.info()`, `log.error()`, `log.warn()` 사용 가능

**직접 해보기:** `@Builder`를 사용하지 않고 일반 생성자로 객체를 만들어보고, `@Builder`로 바꿨을 때 어떻게 달라지는지 비교해보세요.

---

### 2. DTO 설계 - Request / Response

> DTO(Data Transfer Object): 계층 간 데이터를 전달하는 순수 데이터 객체입니다.

#### Request DTO (쿼리 파라미터 수신)

```java
@Getter
@Setter
public class MemberManageRequestDTO {

    private String keyword;   // 검색어 (null이면 전체)
    private String memRole;   // 권한 필터
    private String isUsing;   // 상태 필터
    private int page = 1;     // 기본값 설정 가능
    private int size = 10;

    // MyBatis에서 #{offset}으로 직접 호출 가능한 계산 메서드
    public int getOffset() {
        return (page - 1) * size;
    }
}
```

**핵심 포인트:**
- `int page = 1` → 쿼리 파라미터가 없으면 자동으로 1이 들어감
- `getOffset()`처럼 계산 로직을 DTO 안에 넣으면 MyBatis XML에서 `#{offset}`으로 바로 사용 가능
- `@RequestParam` 없이 컨트롤러 파라미터에 DTO를 쓰면 Spring이 자동으로 쿼리 파라미터를 매핑

#### Response DTO (@Builder 패턴)

```java
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class MemberListResponseDTO {
    private List<MemberDTO> members;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int size;
}

// 사용 예 (ServiceImpl에서)
return MemberListResponseDTO.builder()
        .members(members)
        .currentPage(request.getPage())
        .totalPages(totalPages)
        .totalElements(totalElements)
        .size(request.getSize())
        .build();
```

**직접 해보기:** `@Builder` 없이 생성자로 위 객체를 만들어보세요. 필드 순서를 틀리면 어떻게 되는지 확인해보세요.

---

### 3. MyBatis Mapper 인터페이스

> Spring이 XML 쿼리와 인터페이스를 연결해주는 계층입니다.

```java
@Mapper  // Spring이 구현체를 자동 생성
public interface ManageMemberMapper {

    // 파라미터가 객체 하나일 때 → @Param 불필요
    List<MemberDTO> selectMemberList(MemberManageRequestDTO request);
    int selectMemberCount(MemberManageRequestDTO request);

    // 파라미터가 여러 개일 때 → @Param 필수!
    // XML에서 #{memEmail}, #{isUsing}으로 참조
    int updateMemberStatus(@Param("memEmail") String memEmail,
                           @Param("isUsing")  String isUsing);

    int updateMemberRole(@Param("memEmail") String memEmail,
                         @Param("memRole")  String memRole);
}
```

**핵심 포인트:**
- 파라미터가 1개: `@Param` 없어도 됨
- 파라미터가 2개 이상: **반드시 `@Param`** 붙여야 XML에서 이름으로 접근 가능
- 반환 타입: 목록 → `List<DTO>`, 단건 조회 → `DTO`, 삽입/수정/삭제 → `int`(영향받은 행 수)

**직접 해보기:** `@Param`을 제거하고 빌드해보면 어떤 오류가 나는지 확인해보세요.

---

### 4. MyBatis XML - ResultMap & 동적 쿼리

#### ResultMap: DB 컬럼 → Java 필드 매핑

```xml
<!-- DB 컬럼명(대문자)과 Java 필드명(카멜케이스)이 다를 때 명시적으로 매핑 -->
<resultMap id="manageMember" type="com.green.book_shop.member.dto.MemberDTO">
    <id     column="MEM_EMAIL"   property="memEmail" />  <!-- PK는 <id> 태그 -->
    <result column="MEM_NAME"    property="memName" />
    <result column="IS_USING"    property="isUsing" />
    <result column="MEM_ROLE"    property="memRole" />
    <result column="JOIN_DATE"   property="joinDate" />
</resultMap>
```

#### 동적 WHERE 절

```xml
<select id="selectMemberList" resultMap="manageMember">
    SELECT MEM_EMAIL, MEM_NAME, IS_USING, MEM_ROLE
    FROM SHOP_MEMBER
    <where>
        <!--
            <where> 태그: 안의 조건이 하나라도 있으면 WHERE를 붙임
            첫 번째 AND는 자동으로 제거해줌
        -->
        <if test="keyword != null and keyword != ''">
            AND (
                MEM_EMAIL LIKE CONCAT('%', #{keyword}, '%')
                OR MEM_NAME LIKE CONCAT('%', #{keyword}, '%')
            )
        </if>
        <if test="memRole != null and memRole != ''">
            AND MEM_ROLE = #{memRole}
        </if>
    </where>
    ORDER BY JOIN_DATE DESC
    LIMIT #{offset}, #{size}   <!-- offset = (page-1)*size, DTO의 getOffset()이 자동 호출됨 -->
</select>

<!-- COUNT 쿼리: 페이지네이션 계산용, LIMIT 없이 동일 WHERE 사용 -->
<select id="selectMemberCount" resultType="int">
    SELECT COUNT(*)
    FROM SHOP_MEMBER
    <where>
        <if test="keyword != null and keyword != ''">
            AND MEM_EMAIL LIKE CONCAT('%', #{keyword}, '%')
        </if>
    </where>
</select>
```

#### UPDATE 쿼리

```xml
<update id="updateMemberStatus">
    UPDATE SHOP_MEMBER
    SET IS_USING = #{isUsing}
    WHERE MEM_EMAIL = #{memEmail}
</update>
```

**핵심 포인트:**
- `<where>` → `WHERE` 자동 처리, 조건 없으면 `WHERE`도 안 붙음
- `<if test="...">` → OGNL 표현식, `and`, `or`는 `&&`, `||` 대신 영문 사용
- `#{변수명}` → PreparedStatement 바인딩 (SQL Injection 방어)
- `LIMIT #{offset}, #{size}` → MariaDB/MySQL 페이지네이션 문법

**직접 해보기:** 조건을 하나도 입력하지 않았을 때 `<where>` 없이 직접 `WHERE 1=1 AND ...`로 작성하면 어떻게 다른지 비교해보세요.

---

### 5. Service - 인터페이스 + 구현체 분리

#### 인터페이스

```java
public interface ManageMemberService {
    MemberListResponseDTO getMemberList(MemberManageRequestDTO request);
    void updateMemberStatus(String memEmail, String isUsing);
    void updateMemberRole(String memEmail, String memRole);
}
```

#### 구현체

```java
@Service             // Bean 등록
@RequiredArgsConstructor  // final 필드 생성자 주입
@Slf4j               // log 변수
public class ManageMemberServiceImpl implements ManageMemberService {

    private final ManageMemberMapper manageMemberMapper;  // 생성자 주입

    @Override
    public MemberListResponseDTO getMemberList(MemberManageRequestDTO request) {
        // 1. 목록 조회
        List<MemberDTO> members = manageMemberMapper.selectMemberList(request);

        // 2. 전체 수 조회 (같은 조건)
        int totalElements = manageMemberMapper.selectMemberCount(request);

        // 3. 페이지 수 계산: ceil(총 수 / 페이지 크기)
        int totalPages = (int) Math.ceil((double) totalElements / request.getSize());

        // 4. 보안 처리: 비밀번호 null 처리
        members.forEach(member -> member.setMemPw(null));

        // 5. 빌더로 응답 DTO 생성
        return MemberListResponseDTO.builder()
                .members(members)
                .totalPages(totalPages)
                .totalElements(totalElements)
                .build();
    }

    @Override
    @Transactional  // DB 작업이 실패하면 자동 롤백
    public void updateMemberStatus(String memEmail, String isUsing) {
        // 입력값 검증 (화이트리스트 방식)
        if (!"Y".equals(isUsing) && !"N".equals(isUsing)) {
            throw new RuntimeException("올바르지 않은 상태값입니다.");
        }

        int result = manageMemberMapper.updateMemberStatus(memEmail, isUsing);

        // 영향받은 행이 0이면 대상이 없음 → 예외 발생
        if (result == 0) {
            throw new RuntimeException("회원을 찾을 수 없습니다: " + memEmail);
        }
    }

    @Override
    @Transactional
    public void updateMemberRole(String memEmail, String memRole) {
        // Set.of()로 허용 값 목록을 만들고 contains()로 검증
        Set<String> validRoles = Set.of("USER", "MANAGER", "ADMIN");
        if (!validRoles.contains(memRole)) {
            throw new RuntimeException("올바르지 않은 권한값입니다.");
        }
        // ...
    }
}
```

**핵심 포인트:**
- 인터페이스를 먼저 정의하는 이유: Controller가 구현체가 아닌 인터페이스에 의존 → 나중에 구현체 교체 가능
- `@Transactional`: 메서드 실행 중 예외가 발생하면 DB 변경사항 전체 롤백
- `Math.ceil((double) totalElements / size)`: 정수 나눗셈은 버림이므로 `(double)` 캐스팅 필수
- `result == 0` 체크: UPDATE 후 영향받은 행이 없으면 존재하지 않는 대상

**직접 해보기:** `(double)` 없이 `Math.ceil(totalElements / size)`를 계산하면 어떻게 되는지 확인해보세요. (ex: 11/10 → 1이 되어버림)

---

### 6. Controller - REST API 설계

```java
@RestController                  // @Controller + @ResponseBody: JSON 자동 직렬화
@RequestMapping("/manage/members") // 공통 URL prefix
@RequiredArgsConstructor
@Slf4j
public class ManageMemberController {

    private final ManageMemberService manageMemberService;

    // GET /manage/members?keyword=kim&page=1
    @GetMapping("")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")  // 권한 체크 (인증 필터보다 먼저)
    public ResponseEntity<?> getMemberList(MemberManageRequestDTO request) {
        // 쿼리 파라미터 → DTO 자동 바인딩 (@RequestParam 불필요)
        try {
            MemberListResponseDTO data = manageMemberService.getMemberList(request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", data
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // PATCH /manage/members/{memEmail}/status
    @PatchMapping("/{memEmail}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> updateMemberStatus(
            @PathVariable String memEmail,       // URL 경로에서 추출
            @RequestBody Map<String, String> body // 요청 Body JSON 파싱
    ) {
        try {
            String isUsing = body.get("isUsing");
            manageMemberService.updateMemberStatus(memEmail, isUsing);
            return ResponseEntity.ok(Map.of("success", true, "message", "변경 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
```

**HTTP 메서드 선택 기준:**
| 메서드 | 용도 | 어노테이션 |
|--------|------|-----------|
| GET | 조회 (데이터 변경 없음) | `@GetMapping` |
| POST | 생성 | `@PostMapping` |
| PUT | 전체 수정 | `@PutMapping` |
| PATCH | 부분 수정 | `@PatchMapping` |
| DELETE | 삭제 | `@DeleteMapping` |

**핵심 포인트:**
- `@PathVariable`: URL 경로의 `{변수명}` 추출 → `/members/{memEmail}`
- `@RequestBody`: 요청 Body의 JSON을 Java 객체로 변환
- `ResponseEntity<?>`: HTTP 상태 코드와 Body를 함께 제어
- `Map.of("success", true, "data", data)`: 간단한 응답 JSON 생성 (불변 맵)

---

## Frontend

---

### 7. API 모듈 작성 패턴

> 모든 API 호출을 별도 파일에 분리해서 재사용성을 높입니다.

```javascript
import axiosInstance from "./axiosInstance";

// GET 요청 (쿼리 파라미터)
export const getMemberList = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/manage/members', { params })
    // { params }는 URL 쿼리 파라미터로 자동 변환됨
    // ex: { keyword: 'kim', page: 1 } → ?keyword=kim&page=1
    return response.data
  } catch (error) {
    // error.response?.data: 서버 응답 Body (없으면 기본 메시지)
    throw error.response?.data || { message: '오류가 발생했습니다.' }
  }
}

// PATCH 요청 (Body + URL 파라미터)
export const updateMemberStatus = async (memEmail, isUsing) => {
  try {
    const response = await axiosInstance.patch(
      `/manage/members/${encodeURIComponent(memEmail)}/status`,
      // ↑ encodeURIComponent: 이메일의 '@'가 URL에서 깨지는 것을 방지
      { isUsing }  // Body: { "isUsing": "Y" }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '변경에 실패했습니다.' }
  }
}
```

**핵심 포인트:**
- `axiosInstance.get(url, { params })` → 자동으로 쿼리 파라미터 변환
- `axiosInstance.patch(url, body)` → Body는 두 번째 인자
- `encodeURIComponent()`: URL에 특수문자(`@`, `+`, `=` 등)가 포함될 때 반드시 사용
- `error.response?.data`: 옵셔널 체이닝(`?.`) → response가 없어도 에러 안 남

**직접 해보기:** `encodeURIComponent('user@test.com')`의 결과를 콘솔에 출력해보세요. `@`가 어떻게 변환되는지 확인하세요.

---

### 8. 공통 컴포넌트 설계

> 여러 곳에서 반복 사용되는 UI를 하나의 컴포넌트로 추출합니다.

```jsx
// StatusBadge.jsx
const StatusBadge = ({ type, value }) => {

  // type과 value에 따라 색상 클래스와 표시 텍스트 결정
  const getBadgeConfig = () => {
    switch (type) {
      case 'status':
        return value === 'Y'
          ? { colorClass: styles.green, label: '활성' }
          : { colorClass: styles.red,   label: '비활성' }

      case 'role':
        if (value === 'ADMIN')   return { colorClass: styles.red,    label: 'ADMIN' }
        if (value === 'MANAGER') return { colorClass: styles.orange, label: 'MANAGER' }
        return                          { colorClass: styles.blue,   label: 'USER' }

      default:
        return { colorClass: styles.gray, label: value ?? '-' }
    }
  }

  const { colorClass, label } = getBadgeConfig()

  // CSS Modules에서 여러 클래스를 적용할 때: 템플릿 리터럴 + 공백
  return (
    <span className={`${styles.badge} ${colorClass}`}>
      {label}
    </span>
  )
}

// 사용 예
<StatusBadge type="status" value="Y" />       // → 활성 (초록)
<StatusBadge type="role" value="MANAGER" />   // → MANAGER (주황)
```

**핵심 포인트:**
- `value ?? '-'`: nullish 병합 연산자 → value가 null/undefined일 때만 '-' 반환
- `\`${styles.badge} ${colorClass}\``: CSS Modules에서 여러 클래스 결합
- 공통 컴포넌트를 만들 기준: 같은 UI가 2곳 이상에서 반복될 때

---

### 9. useState / useEffect / useCallback

```jsx
import { useState, useEffect, useCallback } from 'react'

const MyComponent = () => {

  // useState: 상태 선언
  const [members, setMembers] = useState([])       // 배열 초기값
  const [loading, setLoading] = useState(false)    // boolean 초기값
  const [filters, setFilters] = useState({         // 객체 초기값
    keyword: '',
    memRole: '',
  })

  // useCallback: 함수를 메모이제이션 (deps가 바뀔 때만 함수 재생성)
  const fetchMembers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response = await getMemberList({ ...filters, page })
      if (response.success) {
        setMembers(response.data.members)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [filters])  // filters가 바뀔 때만 fetchMembers 재생성

  // useEffect: 사이드 이펙트 처리 (마운트, 상태 변화 시 실행)
  useEffect(() => {
    fetchMembers(1)
  }, [fetchMembers])
  // fetchMembers가 바뀌면 useEffect 재실행
  // → filters 변경 → fetchMembers 재생성 → useEffect 재실행 → API 호출
```

**useCallback을 쓰는 이유:**
```
filters 변경
  → fetchMembers 재생성 (useCallback 없으면 매 렌더마다 재생성)
    → useEffect가 fetchMembers 변화를 감지
      → API 재호출
```
`useCallback`이 없으면 무한 루프 발생 위험!

**직접 해보기:** `useCallback`을 제거하고 `useEffect`의 deps에 `fetchMembers` 대신 `[filters]`를 넣으면 어떻게 되는지 실험해보세요.

---

### 10. 검색 필터 + 페이지네이션 패턴

```jsx
// 1. 필터 상태를 객체 하나로 관리
const [filters, setFilters] = useState({ keyword: '', memRole: '', isUsing: '' })
const [currentPage, setCurrentPage] = useState(1)

// 2. 고차함수(Higher-order function)로 핸들러 재사용
//    handleFilterChange('keyword') → (e) => setFilters(...) 를 반환
const handleFilterChange = (field) => (e) => {
  setFilters(prev => ({ ...prev, [field]: e.target.value }))
  //                              ↑ 계산된 프로퍼티명: 변수를 키로 사용
}

// 3. 검색 버튼 클릭
const handleSearch = () => {
  setCurrentPage(1)    // 1페이지로 리셋
  fetchMembers(1)
}

// 4. 초기화 버튼 클릭
const handleReset = () => {
  setFilters({ keyword: '', memRole: '', isUsing: '' })  // 필터 리셋
  setCurrentPage(1)
  // filters 변경 → fetchMembers 재생성 → useEffect 자동 재실행
}

// 5. 페이지 변경
const handlePageChange = (page) => {
  setCurrentPage(page)
  fetchMembers(page)
}

// JSX에서 사용
<Input
  value={filters.keyword}
  onChange={handleFilterChange('keyword')}  // 고차함수 호출
/>
<Input
  value={filters.memRole}
  onChange={handleFilterChange('memRole')}  // 동일한 함수 재사용
/>
```

**핵심 포인트:**
- `[field]: e.target.value` → Computed Property Name: 변수를 객체 키로 사용
- `...prev` → Spread: 기존 상태를 유지하면서 특정 필드만 변경
- 고차함수 패턴: `handleFilterChange('keyword')`를 호출하면 이벤트 핸들러 함수를 반환

**직접 해보기:** `handleFilterChange`를 고차함수 없이 각각 `handleKeywordChange`, `handleRoleChange`로 분리해서 작성해보세요. 어느 쪽이 더 간결한지 비교해보세요.

---

### 11. Optimistic UI Update (즉시 갱신)

> API 성공 후 전체 목록을 다시 불러오지 않고, 해당 항목만 즉시 수정합니다.

```jsx
const handleConfirm = async () => {
  const { memEmail, newValue } = confirmModal

  try {
    // 1. API 호출
    await updateMemberStatus(memEmail, newValue)

    // 2. 성공 후: 전체 재조회(fetchMembers) 대신 해당 항목만 업데이트
    setMembers(prev =>
      prev.map(m =>
        m.memEmail === memEmail
          ? { ...m, isUsing: newValue }  // 일치하는 항목만 수정
          : m                            // 나머지는 그대로
      )
    )
    // ↑ 장점: 네트워크 요청 1번 절약, 화면이 깜빡이지 않음

    setConfirmModal(null)
  } catch (error) {
    alert(error.message)
  }
}
```

**`prev.map()` 함수형 업데이트:**
```jsx
// setState에 함수를 넘기면 항상 최신 상태(prev)를 보장
setMembers(prev => prev.map(m => m.id === targetId ? { ...m, field: newValue } : m))

// 직접 상태값을 쓰는 것(아래)보다 안전
setMembers(members.map(m => ...))  // 클로저 문제로 오래된 값 참조 가능
```

---

### 12. 모달 패턴

```jsx
// 모달 상태: null이면 닫힘, 객체이면 열림 (필요한 데이터 포함)
const [confirmModal, setConfirmModal] = useState(null)

// 모달 열기
const handleStatusClick = (member) => {
  setConfirmModal({
    type: 'status',
    memEmail: member.memEmail,
    newValue: member.isUsing === 'Y' ? 'N' : 'Y',
  })
}

// 모달 닫기
const handleCancel = () => setConfirmModal(null)

// JSX
{confirmModal && (
  // overlay: 바깥 클릭 시 닫힘
  <div className={styles.modalOverlay} onClick={handleCancel}>
    {/* 모달 내부 클릭 시 overlay의 onClick 실행 방지 */}
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <h3>변경 확인</h3>
      <p>{confirmModal.memEmail} 의 상태를 변경하시겠습니까?</p>
      <button onClick={handleConfirm}>확인</button>
      <button onClick={handleCancel}>취소</button>
    </div>
  </div>
)}
```

**핵심 포인트:**
- 모달 상태를 `null` / `객체`로 관리 → `boolean` 대신 `객체`를 쓰면 데이터도 함께 저장
- overlay에 `onClick={handleCancel}` → 바깥 클릭으로 닫기
- 내부 div에 `e.stopPropagation()` → 이벤트 버블링 차단 (아래 설명 참고)

---

### 13. 아코디언 패턴

```jsx
// Set으로 현재 펼쳐진 항목들의 ID를 관리
const [openItems, setOpenItems] = useState(new Set())

// 데이터 로드 시 모두 펼침
const fetchBuyList = async () => {
  const response = await getBuyList()
  if (response.success) {
    setBuyList(response.buyList)
    // 모든 buyNum을 Set에 추가 → 기본으로 전부 열림
    setOpenItems(new Set(response.buyList.map(b => b.buyNum)))
  }
}

// 토글 함수
const toggleAccordion = (buyNum) => {
  setOpenItems(prev => {
    const next = new Set(prev)  // Set 복사 (불변성 유지)
    if (next.has(buyNum)) {
      next.delete(buyNum)  // 이미 열려있으면 닫기
    } else {
      next.add(buyNum)     // 닫혀있으면 열기
    }
    return next
  })
}

// JSX
{buyList.map(buy => {
  const isOpen = openItems.has(buy.buyNum)  // 이 항목이 열려있는지 확인

  return (
    <div key={buy.buyNum}>
      {/* 헤더 클릭 → 토글 */}
      <div onClick={() => toggleAccordion(buy.buyNum)}>
        <span>{buy.buyNum}</span>
        {/* 조건부 아이콘 */}
        {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
      </div>

      {/* 조건부 렌더링: isOpen일 때만 상세 표시 */}
      {isOpen && (
        <div className={styles.detail}>
          {/* 상세 내용 */}
        </div>
      )}
    </div>
  )
})}
```

**Set을 쓰는 이유:**
- `boolean` 하나로는 항목이 여러 개일 때 각각의 열림 상태 관리 불가
- `Set.has()`, `Set.add()`, `Set.delete()`로 O(1) 시간에 확인/추가/삭제
- 배열의 `includes()`를 쓸 수도 있지만 Set이 더 의미에 맞음

---

### 14. 이벤트 버블링 방지

> 클릭 이벤트는 자식 → 부모 방향으로 전파(버블링)됩니다.

```jsx
// 문제 상황: 헤더 전체를 클릭 가능하게 만들었을 때
<div onClick={() => toggleAccordion(buy.buyNum)}>  {/* 부모 */}
  <span>주문 번호</span>
  <img
    onClick={() => navigate('/books/1')}  {/* 자식 */}
    src="..."
  />
</div>
// 이미지 클릭 시:
// 1. img의 onClick 실행 (navigate)
// 2. 이벤트가 부모로 버블링
// 3. div의 onClick도 실행 (toggleAccordion) ← 원하지 않는 동작!

// 해결: e.stopPropagation()으로 버블링 차단
<img
  onClick={(e) => {
    e.stopPropagation()       // 버블링 중단!
    navigate('/books/1')
  }}
  src="..."
/>
```

**모달에서도 같은 원리:**
```jsx
<div onClick={handleCancel}>         {/* overlay: 클릭하면 닫기 */}
  <div onClick={(e) => e.stopPropagation()}>  {/* 내부: 클릭해도 닫히면 안 됨 */}
    모달 내용
  </div>
</div>
```

---

## 전체 흐름 정리

### Backend 계층 흐름
```
HTTP 요청
  └→ Controller (@RestController)
        └→ Service Interface (ManageMemberService)
              └→ ServiceImpl (@Service, @Transactional)
                    └→ Mapper Interface (@Mapper)
                          └→ XML 쿼리 (manage-member-mapper.xml)
                                └→ DB (MariaDB)
```

### Frontend 계층 흐름
```
사용자 액션
  └→ Component (ManageMemberStatus.jsx)
        └→ API 모듈 (manageMemberApi.js)
              └→ axiosInstance (JWT 헤더 자동 첨부)
                    └→ Spring Controller
                          └→ 응답 수신 → 상태 업데이트 → 리렌더링
```

### 공부 순서 추천
1. **MyBatis XML** 동적 쿼리를 직접 작성해보기 (`<where>`, `<if>` 패턴)
2. **Mapper 인터페이스** → `@Param` 유무에 따른 차이 확인
3. **ServiceImpl** → `Math.ceil` 페이지 계산, `@Transactional`의 역할
4. **Controller** → `@PathVariable`, `@RequestBody` 사용 구분
5. **React API 모듈** → `encodeURIComponent` 실험
6. **useCallback + useEffect** → 의존성 배열 변경 실험
7. **아코디언** → `Set` 대신 배열로 같은 기능 구현해보기
