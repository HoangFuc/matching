---
name: rn-test-reviewer
description: >
  Review and manage React Native test files (Jest + React Native Testing Library) in two modes:
  Mode A — compare an old test file vs a new test file (diff + summary + accept/reject);
  Mode B — compare a source/hook file (e.g. useLogin.ts) against its test file (useLogin.test.ts)
  to detect coverage gaps, then generate missing tests and let user accept (write to test file) or reject.
  Trigger on: "review test changes", "compare test files", "kiểm tra thay đổi test", "so sánh file test",
  "update logic rồi muốn check test", "so sánh logic mới với test", "file .ts với file .test.ts",
  "coverage còn thiếu không", or whenever a source file and its corresponding test file are both mentioned.
---

# React Native Test Reviewer

Supports two modes. **Detect the mode automatically** from user input:

| Mode  | Input                              | Mục đích                                             |
| ----- | ---------------------------------- | ---------------------------------------------------- |
| **A** | `old.test.tsx` + `new.test.tsx`    | So sánh 2 phiên bản test, accept/reject              |
| **B** | `useLogin.ts` + `useLogin.test.ts` | Phân tích coverage gap, sinh test mới, accept/reject |

---

## 🔀 Mode Detection

- Nếu user cung cấp **2 file test** (cả hai có đuôi `.test.` hoặc `.spec.`) → **Mode A**
- Nếu user cung cấp **1 source file + 1 test file** (một file không có `.test.`/`.spec.`) → **Mode B**
- Nếu không rõ → hỏi: _"Bạn muốn so sánh 2 file test với nhau, hay muốn kiểm tra xem test có cover đủ logic mới chưa?"_

---

# MODE A — So sánh hai file test

## A1 — Identify Files

- **Old file**: baseline (e.g. `LoginScreen.test.old.tsx`)
- **New file**: phiên bản mới (e.g. `LoginScreen.test.tsx`)

## A2 — Read & Diff

```bash
cat <old_file>
cat <new_file>
diff -u <old_file> <new_file> || true
```

Hiển thị diff trong code block với syntax `diff`.

## A3 — AI Summary

Bảng tóm tắt:

| Hạng mục                | Chi tiết                                   |
| ----------------------- | ------------------------------------------ |
| **Test cases mới**      | Tên các `it()`/`test()` block thêm vào     |
| **Test cases bị xóa**   | Tên các block bị loại bỏ                   |
| **Test cases được sửa** | Các block thay đổi assertion/logic         |
| **Import thay đổi**     | Thư viện/component thêm hoặc bỏ            |
| **Mock thay đổi**       | `jest.mock()`, `jest.spyOn()` thêm/sửa/xóa |
| **Nhận xét chung**      | 2–3 câu đánh giá chất lượng                |

## A4 — Accept / Reject

```
✅ Accept — Ghi đè file cũ bằng nội dung file mới
❌ Reject — Revert file mới về nội dung file cũ
```

### Nếu Accept:

```bash
cp <new_file> <old_file>
```

Confirm: `✅ Đã cập nhật <old_file> với nội dung mới.`

### Nếu Reject:

```bash
cp <old_file> <new_file>
```

Confirm: `↩️ Đã revert <new_file> về nội dung cũ.`

---

# MODE B — So sánh source file với test file

Dùng khi: _"Tôi vừa update logic ở useLogin.ts, muốn xem test có cover đủ chưa"_

## B1 — Identify Files

- **Source file**: file logic vừa sửa (e.g. `useLogin.ts`, `authService.ts`, `LoginScreen.tsx`)
- **Test file**: file test tương ứng (e.g. `useLogin.test.ts`, `authService.test.ts`)

## B2 — Read Both Files

```bash
cat <source_file>
cat <test_file>
```

## B3 — Phân tích Coverage Gap

Đọc kỹ source file, liệt kê tất cả:

- Các **function/method** được export
- Các **branch logic**: `if/else`, `try/catch`, error states, loading states
- Các **async flow**: loading → success / loading → failure
- Các **side effect**: navigation, storage, API call, event emit
- Các **edge case**: empty input, null, undefined, network error, timeout

Sau đó đối chiếu với test file và tạo bảng:

### 📊 Phân tích Coverage

| Logic trong source                  | Test hiện có?                             | Đánh giá  |
| ----------------------------------- | ----------------------------------------- | --------- |
| `loginWithEmail()` — success        | ✅ `it('should login successfully')`      | Đủ        |
| `loginWithEmail()` — wrong password | ❌ Chưa có                                | **Thiếu** |
| `loginWithEmail()` — network error  | ❌ Chưa có                                | **Thiếu** |
| `logout()`                          | ✅ `it('should clear token on logout')`   | Đủ        |
| Loading state khi đang gọi API      | ⚠️ Có nhưng không assert `isLoading=true` | Yếu       |

Ký hiệu: ✅ Đủ / ⚠️ Có nhưng yếu / ❌ Thiếu hoàn toàn

Nếu không có gap nào → báo: _"Test đã cover đủ logic hiện tại ✅"_ và dừng lại.

## B4 — Sinh Test Cases Mới

Với mỗi gap ❌ hoặc ⚠️, viết test case đầy đủ. Chọn đúng pattern:

**Custom Hook** → dùng `renderHook` + `act`:

```typescript
it('should set error when password is wrong', async () => {
  mockLoginApi.mockRejectedValueOnce(new Error('Invalid credentials'));
  const { result } = renderHook(() => useLogin());

  await act(async () => {
    await result.current.login('user@test.com', 'wrongpass');
  });

  expect(result.current.error).toBe('Sai mật khẩu hoặc email');
  expect(result.current.isLoading).toBe(false);
});
```

**Component** → dùng `render` + `screen` + `waitFor`:

```typescript
it('should show error message on invalid email', async () => {
  render(<LoginScreen />);
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'not-an-email');
  fireEvent.press(screen.getByRole('button', { name: /đăng nhập/i }));
  await waitFor(() => {
    expect(screen.getByText('Email không hợp lệ')).toBeVisible();
  });
});
```

**Service/Utility** → dùng Jest thuần:

```typescript
it('should throw when token is expired', async () => {
  mockStorage.getItem.mockResolvedValueOnce(expiredToken);
  await expect(authService.getValidToken()).rejects.toThrow('Token expired');
});
```

Sinh **code đầy đủ, chạy được** — không viết placeholder hay `// TODO`.

## B5 — Hiển thị File Test Đề Xuất

Hiển thị **toàn bộ nội dung file test mới** (giữ nguyên test cũ + append test mới vào đúng `describe` block), trong code block TypeScript.

## B6 — Accept / Reject

```
✅ Accept — Ghi nội dung mới vào <test_file>
❌ Reject — Giữ nguyên <test_file>, không thay đổi gì
```

### Nếu Accept:

```bash
# Backup trước
cp <test_file> <test_file>.bak
# Ghi nội dung mới (thay <content> bằng nội dung thực)
python3 -c "
content = '''<nội dung file test đề xuất>'''
with open('<test_file>', 'w') as f:
    f.write(content)
"
```

Confirm: `✅ Đã cập nhật <test_file> với N test cases mới. Backup: <test_file>.bak`

### Nếu Reject:

Không thay đổi file nào.
Confirm: `↩️ Đã giữ nguyên <test_file>, không có gì thay đổi.`

---

## ⚠️ Edge Cases (cả hai mode)

| Tình huống                              | Xử lý                                               |
| --------------------------------------- | --------------------------------------------------- |
| Không tìm thấy file                     | Báo lỗi path cụ thể, dừng lại                       |
| Test file chưa tồn tại (Mode B)         | Đề xuất tạo file test mới từ đầu cho toàn bộ source |
| Source không thay đổi, test đã cover đủ | Báo "Coverage đầy đủ" — không sinh test mới         |
| Diff quá lớn (>300 dòng)                | Tóm tắt phần quan trọng, hỏi xem full không         |
| Hai file trùng path                     | Báo lỗi, không thực hiện                            |

---

## 📌 RNTL Patterns — Chuẩn ưu tiên khi sinh test mới

- `renderHook` + `act` cho custom hooks
- `screen.getByRole`, `screen.getByText` — KHÔNG dùng `getByTestId`
- `waitFor` cho mọi assertion async
- `jest.spyOn` thay vì mock toàn module nếu chỉ cần override 1 function
- `userEvent` thay `fireEvent` nếu project dùng RNTL v7+
- KHÔNG dùng `toMatchSnapshot` cho logic mới
