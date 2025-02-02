import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  Button,
  Modal,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from '@mui/material';
import AppTheme from '../../../shared-theme/AppTheme';
import SideMenu from '../common/SideMenu';
import Header from '../common/Header'
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function CompanyProduct() {
  
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_no: '',
    product_name: '',
    product_content: '',
    product_img: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const getAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getCompanies = async () => {
    try {
      const response = await fetch('http://localhost:8000/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getCompanies();
  }, []);

  const handleFilter = (company_no) => {
    setSelectedCompany(company_no);
    if (company_no === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.company_no === company_no));
    }
  };

  const handleSearch = () => {
    if (searchQuery === '') {
      handleFilter(selectedCompany);
    } else {
      const filtered = products.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setFormData({
      company_no: product.company_no,
      product_name: product.product_name,
      product_content: product.product_content,
      product_img: product.product_img,
    });
    setPreviewImage(product.product_img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setPreviewImage(null);
  };

  const handleRegisterOpen = () => {
    setFormData({ company_no: '', product_name: '', product_content: '', product_img: null });
    setPreviewImage(null);
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, product_img: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('product_no', selectedProduct.product_no);
    formDataToSend.append('product_name', formData.product_name);
    formDataToSend.append('product_content', formData.product_content);
    if (formData.product_img) {
      formDataToSend.append('image', formData.product_img);
    }

    try {
      const response = await fetch(`http://localhost:8000/change_product`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('상품 정보가 수정되었습니다!');
        setOpen(false);
        getAllProducts();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCreateProduct = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('company_no', formData.company_no);
    formDataToSend.append('product_name', formData.product_name);
    formDataToSend.append('product_content', formData.product_content);
    if (formData.product_img) {
      formDataToSend.append('image', formData.product_img);
    }

    try {
      const response = await fetch('http://localhost:8000/create_product', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('새로운 상품이 등록되었습니다!');
        setRegisterOpen(false);
        getAllProducts();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
           <Header/>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            상품 관리
          </Typography>
          <Stack direction="row" spacing={2} mb={3} alignItems="center">
            <Select
              value={selectedCompany}
              onChange={(e) => handleFilter(e.target.value)}
              displayEmpty
              sx={{ width: '150px' }} // 기업 필터 크기 조정
            >
              <MenuItem value="">기업 필터</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_no} value={company.company_no}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              placeholder="상품 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }} // 검색창 길게 조정
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              검색
            </Button>
            <Button variant="contained" color="secondary" onClick={handleRegisterOpen}>
              상품 추가
            </Button>
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>기업 이름</TableCell>
                  <TableCell>상품 이름</TableCell>
                  <TableCell>포인트</TableCell>
                  <TableCell>상세 정보</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow key={product.product_no}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {companies.find((c) => c.company_no === product.company_no)?.company_name}
                    </TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.points || '100'}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleOpen(product)}>
                        확인
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
                    {/* 수정 모달 */}
                    <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={2}>
                상품 수정
              </Typography>
              <TextField
                label="기업 이름"
                value={
                  companies.find((c) => c.company_no === formData.company_no)?.company_name || ''
                }
                disabled
                fullWidth
                margin="normal"
              />
              <TextField
                label="상품 이름"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="상품 세부내용"
                name="product_content"
                value={formData.product_content}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              {previewImage && (
                <Box mb={2} display="flex" justifyContent="center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
              <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                이미지 변경
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" onClick={handleClose}>
                  취소
                </Button>
                <Button variant="contained" onClick={handleUpdate}>
                  수정
                </Button>
              </Stack>
            </Box>
          </Modal>

          {/* 등록 모달 */}
          <Modal open={registerOpen} onClose={handleRegisterClose}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={2}>
                상품 등록
              </Typography>
              <Select
                name="company_no"
                value={formData.company_no}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="">기업 선택</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.company_no} value={company.company_no}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="상품 이름"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="상품 세부내용"
                name="product_content"
                value={formData.product_content}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              {previewImage && (
                <Box mb={2} display="flex" justifyContent="center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
              <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                이미지 업로드
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" onClick={handleRegisterClose}>
                  취소
                </Button>
                <Button variant="contained" onClick={handleCreateProduct}>
                  등록
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      </Box>
    </AppTheme>
  );
}
