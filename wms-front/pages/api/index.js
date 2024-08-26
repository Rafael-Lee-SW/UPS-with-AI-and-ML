// 사업체 회원가입 추가 필요

import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://i11a508.p.ssafy.io/api/',
});
// 유저 조회
function fetchUser(id) {
    return instance.get(`/users/${id}`)
}

// 유저 수정
function editUser(id, data = {}) {
    return instance.put(`users/${id}`, data)
}

// 사업체 등록
function createBusiness(id, data = {}) {
    return instance.post(`/businesses?userId=${id}`, data)
} 

// 특정 사업체 조회
function fetchBusiness(id) {
    return instance.get(`/businesses/${id}`);
}

// 사업체 정보 수정
function editBusiness(id, data = {}) {
    return instance.put(`/businesses/${id}`, data);
}

// 사업체 삭제
function deleteBusiness(id) {
    return instance.patch(`/businesses/${id}`);
}

// 모든 직원 조회
function fetchEmployees() {
    return instance.get('/employees');
}

// 특정 사업체 직원 조회
function fetchBusinessEmployees(id) {
    return instance.get(`/users?businessId=${id}`);
}

// 특정 사업체에 직원 추가
function addEmployeeToBusiness(businessId, employeeId) {
    return instance.put(`/users?id=${employeeId}&businessId=${businessId}`);
}

// 특정 사업체의 직원 삭제
function deleteBusinessEmployee(employeeId, businessId) {
    return instance.patch(`/users?id=${employeeId}&businessId=${businessId}`);
}

// 특정 직원 조회
function fetchEmployee(id) {
    return instance.get(`/users/${id}`);
}

// 이메일로 특정 직원 조회
function fetchEmployeeByEmail(email) {
    return instance.get(`/users?email=${email}`);
}

// 특정 직원 정보 수정
function editEmployee(id, data = {}) {
    return instance.put(`/users/${id}`, data);
}

// 특정 직원 정보 삭제
function deleteEmployee(id) {
    return instance.patch(`/users/${id}`);
}

// 창고 생성
function createWarehouses(data = {}) {
    return instance.post('/warehouses', data);
}

// 특정 사업체의 모든 창고 정보 조회
function fetchBusinessWarehouses(businessId) {
    return instance.get(`/warehouses?businessId=${businessId}`)
}

// 특정 창고 조회
function fetchWarehouse(id) {
    return instance.get(`/warehouses/${id}`)
}

// 창고 수정
function editBusinessWarehouses(id, data = {}) {
    return instance.put(`/warehouses/${id}`, data)
}

// 창고 삭제
function deleteBusinessWarehouses(id) {
    return instance.patch(`/warehouses/${id}`)
}

// 특정 사업체 구독 조회
function fetchBusinessSubscriptions(businessId) {
    return instance.get(`/subscriptions?businessId=${businessId}`)
}

// 구독 등록
function createSubscription(data = {}) {
    return instance.post('/subscriptions', data)
}

// 구독 수정
function editSubscription(id, data = {}) {
    return instance.put(`/subscriptions/${id}`, data)
}

// 구독 삭제
function deleteSubscription(id) {
    return instance.patch(`/subscriptions/${id}`)
}

// 사업체의 상품 전체 조회
function fetchBusinessProducts(businessId) {
    return instance.get(`/products?businessId=${businessId}`)
}

// 창고의 상품 전체 조회
function fetchWarehouseProducts(warehouseId) {
    return instance.get(`/products?warehouseId=${warehouseId}`)
}

// 상품 정보에 따른 조회
function fetchDetailProducts(productDetailId) {
    return instance.get(`/products?productDetailId=${productDetailId}`)
}

// 특정 상품 조회
function fetchProduct(id) {
    return instance.get(`/products/${id}`)
}

// 상품 등록
function createProduct(data = {}) {
    return instance.post('/products', data)
}

// 상품 수정
function editProduct(id, data = {}) {
    return instance.put(`/products/${id}`, data)
}

// 상품 삭제
function deleteProduct(id) {
    return instance.patch(`/products/${id}`)
}

// 상품 입고
function importProducts(data = {}) {
    return instance.post('/products/import', data)
}

// 상품 입고 내역 조회 
function fetchImport(businessId) {
    return instance.get(`/products/import?businessId=${businessId}`)
}

// 상품 출고
function exportProducts(data = {}) {
    return instance.post('/products/export', data)
}

// 상품 출고 내역 조회
function fetchExport(businessId) {
    return instance.get(`/products/export?businessId=${businessId}`)
}

// 사업체의 입고, 출고 내역 조회
function fetchNotifications(businessId) {
    return instance.get(`products/notification?businessId=${businessId}`)
}

// 특정 상품 정보 조회
function fetchProductDetail(id) {
    return instance.get(`/productDetail/${id}`)
}

// 특정 사업자의 상품 정보 조회
function fetchBusinessProductsDetail(businessId) {
    return instance.get(`/product?businessId=${businessId}`)
}

// 상품 정보 등록
function createProductDetail(data = {}) {
    return instance.post('/productDetails', data)
}

// 상품 정보 삭제
function deleteProductDetail(id) {
    return instance.patch(`/productDetails/${id}`)
}

// 특정 창고에 있는 로케이션 전체 조회
function fetchWarehouseLocations(warehouseId) {
    return instance.get(`/locations?=warehouseId=${warehouseId}`)
}

// 특정 로케이션 조회
function fetchLocation(locationId) {
    return instance.get(`/locations/${locationId}`)
}

// 로케이션 등록
function createLocation(data = {}) {
    return instance.post('/locations', data)
}

// 로케이션 수정
function editLocation(locationId, data = {}) {
    return instance.put(`/locations/${locationId}`, data)
}

// 로케이션 삭제
function deleteLocation(locationId) {
    return instance.patch(`/locations/${locationId}`)
}

// 특정 층 단일 조회
function fetchFloors(floorId) {
    return instance.get(`/floors/${floorId}`)
}

// 특정 로케이션에 있는 층 전부 조회
function fetchLocationFloors(locationId) {
    return instance.get(`/floors?locationId=${locationId}`)
}
 
export { 
    instance, 
    fetchUser,
    editUser,
    createBusiness,
    fetchBusiness, 
    editBusiness,
    deleteBusiness,
    fetchEmployees, 
    fetchBusinessEmployees,
    addEmployeeToBusiness,
    deleteBusinessEmployee,
    fetchEmployee,
    fetchEmployeeByEmail,
    editEmployee,
    deleteEmployee,
    createWarehouses,
    fetchWarehouse,
    editBusinessWarehouses,
    deleteBusinessWarehouses,
    fetchBusinessWarehouses,
    fetchBusinessSubscriptions,
    createSubscription,
    editSubscription,
    deleteSubscription,
    fetchBusinessProducts,
    fetchWarehouseProducts,
    fetchDetailProducts,
    fetchProduct,
    createProduct,
    editProduct,
    deleteProduct,
    fetchImport,
    importProducts,
    fetchExport,
    fetchNotifications,
    exportProducts,
    fetchProductDetail,
    fetchBusinessProductsDetail,
    createProductDetail,
    deleteProductDetail,
    fetchWarehouseLocations,
    fetchLocation,
    createLocation,
    editLocation,
    deleteLocation,
    fetchFloors,
    fetchLocationFloors,
}   