import {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
// import Image from 'next/image'
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Tab,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ButtonLeft,
  ButtonMarkup,
  ButtonMarkupType,
  ButtonRight,
  ClickableArea,
  ContainerInformation,
  LabelButtonMarkupType,
  TabsContainer,
  TextAreaField,
  Title,
} from './styles'
import { InspectionDropzone } from './DropZone'
// import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import dayjs from 'dayjs'
import { StagesDataProps } from '@/pages/checklist/types'

// import carroFrenteImg from '@/assets/images/inspection/carro-frente.svg'

interface ModalInspectCarProps {
  isOpen: boolean
  closeModalInspectCar: () => void
  stageData: StagesDataProps | undefined
}
type markupTypesEnum = 'amassado' | 'riscado' | 'quebrado' | 'faltando' | 'none'

interface TabPanelProps {
  children?: ReactNode
  dir?: string
  index: number
  value: number
}

interface imageData {
  id: number
  name: string
  url: string
  size: string
}

interface imagemList {
  frente: imageData[]
  lateralEsquerdo: imageData[]
  lateralDireito: imageData[]
  traseira: imageData[]
  teto: imageData[]
}

type MarkupType = {
  id: number
  type: markupTypesEnum
  positions: {
    top: string
    left: string
  }
}

const markupTagTypes: { [key: string]: string } = {
  amassado: 'A',
  riscado: 'R',
  quebrado: 'Q',
  faltando: 'F',
}

type MarkupListType = {
  frente: MarkupType[]
  lateralEsquerdo: MarkupType[]
  lateralDireito: MarkupType[]
  traseira: MarkupType[]
  teto: MarkupType[]
}
type ObservationsType = {
  frente: string
  lateralEsquerdo: string
  lateralDireito: string
  traseira: string
  teto: string
}
type ImgPositionCarUrlType = {
  frente: string
  lateralEsquerdo: string
  lateralDireito: string
  traseira: string
  teto: string
}

type positionsTypes =
  | 'frente'
  | 'lateralEsquerdo'
  | 'lateralDireito'
  | 'traseira'
  | 'teto'

const positionsCar: Array<positionsTypes> = [
  'frente',
  'lateralEsquerdo',
  'lateralDireito',
  'traseira',
  'teto',
]

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            position: 'relative',
            cursor: 'pointer',
            width: 490,
            height: 350,
            marginRight: 10,
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

export default function ModalInspectCar({
  isOpen,
  closeModalInspectCar,
  stageData,
}: ModalInspectCarProps) {
  const theme = useTheme()
  const [tabsValue, setTabsValue] = useState(0)
  const [markupValue, setMarkupValue] = useState<markupTypesEnum>('none')
  const [markups, setMarkups] = useState<MarkupListType>({
    frente: [],
    lateralEsquerdo: [],
    lateralDireito: [],
    traseira: [],
    teto: [],
  })
  const [listImagesUpload, setListImagesUpload] = useState<imagemList>({
    frente: [],
    lateralEsquerdo: [],
    lateralDireito: [],
    traseira: [],
    teto: [],
  })
  const [observations, setObservations] = useState<ObservationsType>({
    frente: '',
    lateralEsquerdo: '',
    lateralDireito: '',
    traseira: '',
    teto: '',
  })
  const [imgPositionCarUrl, setImgPositionCarUrl] =
    useState<ImgPositionCarUrlType>({
      frente: '',
      lateralEsquerdo: '',
      lateralDireito: '',
      traseira: '',
      teto: '',
    })

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabsValue(newValue)
  }

  const handleClose = () => {
    closeModalInspectCar()
  }

  function getClickCoords(event: any) {
    const e = event.target
    const dim = e.getBoundingClientRect()
    const x = event.clientX - dim.left
    const y = event.clientY - dim.top
    return [x, y]
  }

  const removeMarkup = (id: number) => {
    setMarkups((prevState) => {
      return {
        ...prevState,
        [positionsCar[tabsValue]]: prevState[positionsCar[tabsValue]].filter(
          (m) => {
            return m.id !== id
          },
        ),
      }
    })
  }

  async function addMarkup(event: any) {
    const [x, y] = getClickCoords(event)
    const positionTop = y - 22
    const positionLeft = x - 22
    if (!Object.hasOwn(markupTagTypes, markupValue)) {
      return
    }

    const idByTimestamp = dayjs(new Date()).valueOf()
    console.log(positionsCar[tabsValue])
    setMarkups((prevState) => {
      return {
        ...prevState,
        [positionsCar[tabsValue]]: [
          ...prevState[positionsCar[tabsValue]],
          {
            id: idByTimestamp,
            type: markupValue,
            positions: {
              top: `${positionTop}px`,
              left: `${positionLeft}px`,
            },
          },
        ],
      }
    })
  }

  const handleChangeMarkupValue = (value: markupTypesEnum) => {
    setMarkupValue(value)
  }

  function handleAddImageUrlList(
    images: imageData[],
    position: positionsTypes,
  ) {
    console.log(images)
    console.log(position)
    setListImagesUpload((prevState) => {
      return {
        ...prevState,
        [position]: [...prevState[position], ...images],
      }
    })
  }

  function handleObservation(event: ChangeEvent<HTMLInputElement>) {
    setObservations((prevState) => {
      return {
        ...prevState,
        [positionsCar[tabsValue]]: event.target.value,
      }
    })
    console.log(event.target.value)
  }

  useEffect(() => {
    setMarkupValue('none')
  }, [tabsValue])

  useEffect(() => {
    const positonsCarData = stageData?.itens.filter(
      (itens) => itens.rules.type === 'visual_inspect',
    )

    const newPositionsUrl = {
      frente: '',
      lateralEsquerdo: '',
      lateralDireito: '',
      traseira: '',
      teto: '',
    }

    if (positonsCarData) {
      positonsCarData[0]?.values?.labels?.forEach((item) => {
        switch (item.name) {
          case 'Frente':
            newPositionsUrl.frente = item.url_image
            break
          case 'Lateral esquerda':
            newPositionsUrl.lateralEsquerdo = item.url_image
            break
          case 'Lateral direita':
            newPositionsUrl.lateralDireito = item.url_image
            break
          case 'Traseira':
            newPositionsUrl.traseira = item.url_image
            break
          case 'Teto':
            newPositionsUrl.teto = item.url_image
            break
          default:
        }
      })
      setImgPositionCarUrl(newPositionsUrl)
    }

    // if (positonsCarData) {
    //   switch (value) {
    //     case 'Frente':
    //       const position = positonsCarData[0]?.values?.labels.filter(
    //         (item) => item.name === 'Frente',
    //       )
    //       return position ? position[0].url_image : ''
    //     case 'Lateral esquerda':
    //       const positionEsquerda = positonsCarData[0]?.values?.labels.filter(
    //         (item) => item.name === 'Lateral esquerda',
    //       )
    //       return positionEsquerda ? positionEsquerda[0].url_image : ''
    //     case 'Lateral direita':
    //       const positionDireita = positonsCarData[0]?.values?.labels.filter(
    //         (item) => item.name === 'Lateral direita',
    //       )
    //       return positionDireita ? positionDireita[0].url_image : ''
    //     case 'Teto':
    //       const positionTraseira = positonsCarData[0]?.values?.labels.filter(
    //         (item) => item.name === 'Traseira',
    //       )
    //       return positionTraseira ? positionTraseira[0].url_image : ''
    //     default:
    //       return ''
    //   }
    // }
  }, [])

  return (
    <Dialog
      open={isOpen}
      // fullScreen={true}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          paddingX: 0,
          paddingTop: 0,
          height: 440,
          overflowY: 'hidden',
        }}
      >
        <AppBar position="static">
          <TabsContainer
            value={tabsValue}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs"
          >
            <Tab label="Frente" {...a11yProps(0)} />
            <Tab
              label="Lateral esquerdo"
              sx={{ whiteSpace: 'nowrap', px: 5 }}
              {...a11yProps(1)}
            />
            <Tab
              label="Lateral direita"
              sx={{ whiteSpace: 'nowrap', px: 4 }}
              {...a11yProps(2)}
            />
            <Tab label="Traseira" {...a11yProps(3)} />
            <Tab label="Teto" {...a11yProps(4)} />
          </TabsContainer>
        </AppBar>
        <Grid container sx={{ padding: 2 }}>
          <Grid
            item
            xs={2}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Stack gap={2}>
              {Object.keys(markupTagTypes).map((item) => (
                <LabelButtonMarkupType key={item}>
                  <ButtonMarkupType
                    selectedActual={markupValue === item}
                    onClick={() => {
                      handleChangeMarkupValue(item as markupTypesEnum)
                    }}
                  >
                    {markupTagTypes[item]}
                  </ButtonMarkupType>
                  <span>{item}</span>
                </LabelButtonMarkupType>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={7}>
            <TabPanel value={tabsValue} index={0} dir={theme.direction}>
              <ClickableArea
                onClick={addMarkup}
                urlImg={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.frente}`}
              />
              {markups.frente.map((m) => {
                return (
                  <ButtonMarkup
                    key={m.id}
                    sx={{
                      position: 'absolute',
                      top: m?.positions?.top,
                      left: m?.positions?.left,
                    }}
                    onClick={() => removeMarkup(m.id)}
                  >
                    <span>{markupTagTypes[m.type]}</span>
                    <DeleteForeverRoundedIcon
                      sx={{ zIndex: 10, position: 'fixed' }}
                    />
                  </ButtonMarkup>
                )
              })}
              {/* </ClickableSVG> */}
            </TabPanel>
            <TabPanel value={tabsValue} index={1} dir={theme.direction}>
              <ClickableArea
                onClick={addMarkup}
                urlImg={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.lateralEsquerdo}`}
              />
              {markups.lateralEsquerdo.map((m) => {
                return (
                  <ButtonMarkup
                    key={m.id}
                    sx={{
                      position: 'absolute',
                      top: m?.positions?.top,
                      left: m?.positions?.left,
                    }}
                    onClick={() => removeMarkup(m.id)}
                  >
                    <span>{markupTagTypes[m.type]}</span>
                    <DeleteForeverRoundedIcon
                      sx={{ zIndex: 10, position: 'fixed' }}
                    />
                  </ButtonMarkup>
                )
              })}
            </TabPanel>
            <TabPanel value={tabsValue} index={2} dir={theme.direction}>
              <ClickableArea
                onClick={addMarkup}
                urlImg={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.lateralDireito}`}
              />
              {markups.lateralDireito.map((m) => {
                return (
                  <ButtonMarkup
                    key={m.id}
                    sx={{
                      position: 'absolute',
                      top: m?.positions?.top,
                      left: m?.positions?.left,
                    }}
                    onClick={() => removeMarkup(m.id)}
                  >
                    <span>{markupTagTypes[m.type]}</span>
                    <DeleteForeverRoundedIcon
                      sx={{ zIndex: 10, position: 'fixed' }}
                    />
                  </ButtonMarkup>
                )
              })}
            </TabPanel>
            <TabPanel value={tabsValue} index={3} dir={theme.direction}>
              <ClickableArea
                onClick={addMarkup}
                urlImg={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.traseira}`}
              />
              {markups.traseira.map((m) => {
                return (
                  <ButtonMarkup
                    key={m.id}
                    sx={{
                      position: 'absolute',
                      top: m?.positions?.top,
                      left: m?.positions?.left,
                    }}
                    onClick={() => removeMarkup(m.id)}
                  >
                    <span>{markupTagTypes[m.type]}</span>
                    <DeleteForeverRoundedIcon
                      sx={{ zIndex: 10, position: 'fixed' }}
                    />
                  </ButtonMarkup>
                )
              })}
            </TabPanel>
            <TabPanel value={tabsValue} index={4} dir={theme.direction}>
              <ClickableArea
                onClick={addMarkup}
                urlImg={`${process.env.NEXT_PUBLIC_APP_API_IMAGE_URL}${imgPositionCarUrl.teto}`}
              />
              {markups.teto.map((m) => {
                return (
                  <ButtonMarkup
                    key={m.id}
                    sx={{
                      position: 'absolute',
                      top: m?.positions?.top,
                      left: m?.positions?.left,
                    }}
                    onClick={() => removeMarkup(m.id)}
                  >
                    <span>{markupTagTypes[m.type]}</span>
                    <DeleteForeverRoundedIcon
                      sx={{ zIndex: 10, position: 'fixed' }}
                    />
                  </ButtonMarkup>
                )
              })}
            </TabPanel>
          </Grid>
          <Grid item xs={3} justifyContent="center">
            <ContainerInformation direction="column">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding={0.7}
              >
                <Title>
                  {/* <IconUpload /> */}
                  imagem
                </Title>
                {/* <IconClose /> */}
              </Stack>
              <Divider />
              <Box sx={{ padding: 1 }}>
                <InspectionDropzone
                  handleAddImageUrlList={handleAddImageUrlList}
                  listImagesUpload={listImagesUpload}
                  positionsCar={positionsCar[tabsValue]}
                />
              </Box>
              <Divider />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                padding={0.7}
              >
                <Title>observações</Title>
                {/* <IconClose /> */}
              </Stack>
              <Divider />
              <Box sx={{ padding: 1 }}>
                {/* @ts-ignore */}
                <TextAreaField
                  id="outlined-multiline-static"
                  multiline
                  rows={5}
                  fullWidth
                  size="small"
                  value={observations[positionsCar[tabsValue]]}
                  onChange={handleObservation}
                />
              </Box>
            </ContainerInformation>
            <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
              <ButtonLeft
                variant="contained"
                onClick={() => {
                  handleClose()
                }}
              >
                salvar
              </ButtonLeft>
              <ButtonRight variant="contained" onClick={handleClose}>
                sair
              </ButtonRight>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}