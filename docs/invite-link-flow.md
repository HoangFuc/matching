# Flow tạo link mời

## Phân quyền theo role

### 1. Director / Director 2
- Có thể tạo **department** và **team**.
- Tạo link mời cho tất cả các role.

### 2. Department Lead
- Chỉ được tạo thêm **link mời**.
- Được chọn department khi có **1 department chưa có thành viên** hoặc **chưa có lead** (case này chưa rõ).
- Đối với role **team_lead** và **team_member**: mời như bình thường.

### 3. Team Leader
- Giống case **Department Lead**.
- Chỉ được tạo thêm **1 link mời team leader** khi có **1 team đang trống**.
- Người được mời sẽ **auto được mời vào team đó**, không cần chọn vị trí.

### 4. Team Member
- Được mời các **member khác vào team của mình**.
