import React from 'react'
import AppTheme from '../../../shared-theme/AppTheme'
import { Box, CssBaseline } from '@mui/material'
import SideMenu from '../common/SideMenu'
import Header from '../common/Header'

const Faq = () => {
  return (    <AppTheme>
    <CssBaseline enableColorScheme />
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideMenu />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
         <Header/>
         </Box>
         </Box>
         </AppTheme>
  )
}

export default Faq