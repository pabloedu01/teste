import * as React from 'react';
import { useForm } from "react-hook-form";
import { useContext, useEffect, useMemo, useState } from 'react';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { DataGrid, GridApi, GridColDef, GridRenderCellParams, GridValueGetterParams,GridKeyValue, useGridApiRef } from '@mui/x-data-grid';


import { AuthContext } from '@/contexts/AuthContext';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@/redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { MultipleSelectCheckmarks } from '@/components/MultipleSelectCheckmarks';
import { ButtonIcon } from '@/styles/pages/service-schedules/styles';
import { ServiceSchedulesListProps } from '@/types/service-schedule';
import { apiCore } from '@/lib/api';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import ActionAlerts from '@/components/ActionAlerts';
import { ActionDeleteConfirmations } from '@/helpers/ActionConfirmations';
import { useRouter } from 'next/router';
import { TableApp } from '@/components/TableApp';

type SignInDataProps = {
  username: string
  password: string
}

const api = new apiCore()


export default function ServiceSchedules() {
  const [rows, setRows] = useState<ServiceSchedulesListProps[]>([])
  const [filterChecked, setFilterChecked] = useState<string[]>([
    'teste 1',
    'teste 2',
    'teste 3',
    'teste 4'
  ])

  const router = useRouter()

  const apiRef = useGridApiRef();


  const handleDelete = (id: number) => {
    setRows(rows.filter(row => row.id !== id))
  }


  const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Número',
    headerClassName: 'super-app-theme--header',
    width: 90,
    type: 'number',
    align: 'center',
    sortable: false
  },
  {
    field: 'client',
    headerName: 'Cliente',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    maxWidth: 230,
     minWidth: 120,
    align: 'left',
    sortable: false
  },
  {
    field: 'plate',
    headerName: 'Placa',
    headerClassName: 'super-app-theme--header',
    width: 90,
    sortable: false
  },
  {
    field: 'chassis',
    headerName: 'Chassis',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    maxWidth: 200,
    minWidth: 120,
    sortable: false
  },
  {
    field: 'technical_consultant',
    headerName: 'Responsavél',
    headerClassName: 'super-app-theme--header',
    // type: 'number',
    flex: 1,
    maxWidth: 120,
    minWidth: 80,
    sortable: false
  },
  {
    field: 'typeEstimate',
    headerName: 'Tipo Orçamento',
    headerClassName: 'super-app-theme--header',
    // type: 'number',
    width: 120,
     sortable: false
  },
  {
    field: 'totalDiscount',
    headerName: 'Tipo Desconto',
    headerClassName: 'super-app-theme--header',
    // type: 'number',
    width: 110,
    align: 'center',
    sortable: false
  },
  {
    field: 'total',
    headerName: 'Total Geral',
    headerClassName: 'super-app-theme--header',
    // type: 'number',
    width: 110,
    align: 'center',
    sortable: false
  },
  {
    field: 'action',
    headerName: 'Ação',
    headerClassName: 'super-app-theme--header',
    sortable: false,
    width: 80,
    align: 'left',
    renderCell: (params: GridRenderCellParams) => {
      const onClick = (e:React.MouseEvent<HTMLElement>) => {
        e.stopPropagation(); 
        const id = params.id;
        console.log(params.id)
        ActionDeleteConfirmations(id as number, handleDelete)
      }
      return (
        <IconButton aria-label="search" color="warning" onClick={onClick} sx={{ marginLeft: 1, color: 'red' }}>
          <Delete />
        </IconButton>
      ) 
    },
  },
  ];




  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      searchText: '',
    }
  });



  // function handleChecked(checked: string[] | []) {
  //   setFilterChecked(checked)
      
    
  // }

  useEffect(() => {
    api.get('/service-schedule?company_id=2&limit=1&page=1')
      .then((response) => {
        const resp = response.data.data
        setRows(resp.map((data: any) => ({
          id: data.id,
          client: data.client.name,  
          plate: data.client_vehicle.plate,
          chassis: data.client_vehicle.chasis,
          technical_consultant: data.technical_consultant.name,
          typeEstimate: 'não definido',
          totalDiscount: 0,
          total: 0
        })))

      })
  },[])

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
       <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
            <Grid container spacing={3}>
              <Grid item xs={8} md={8} lg={8} sx={{display: 'flex', alignItems: 'center'}}>
              <Box sx={{flexWrap: "nowrap", display: 'flex', flex: 1}}>
                <TextField
                  label="Procura"
                  id="outlined-size-small"
                  // defaultValue="Pro"
                  size="small"
                  sx={{flex: 1, width: '100%'}}
                />
        
                <ButtonIcon aria-label="search" color="primary" sx={{marginLeft: 1}}>
                  <SearchIcon />
                </ButtonIcon>
              </Box>
                {/* <Box>
                  <MultipleSelectCheckmarks checkNames={filterChecked} handleChecked={handleChecked} />
                </Box> */}
              </Grid>
            <Grid item xs={12} md={4} lg={4} sx={{display: 'flex', flexDirection: 'column' , alignItems: 'center', justifyContent: 'center' }}>
                <Button size="large" variant="contained" onClick={() => {}} sx={{ alignSelf: 'flex-end' }}>
                  Adicionar novo
                </Button>
              </Grid>
            </Grid>  
          </Paper>
        </Grid>
       
        

          <Grid item xs={12}>
              {/* <TableApp columns={columns} rowsData={rows} /> */}
    
          </Grid>
        </Grid>
      {/* <ActionAlerts isOpen={true} /> */}
    </Container>
    
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

const session = await getSession(ctx)

  if (!session?.user?.token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  return {
    props: {
    }, 
  }
}