import { Empty, MenuProps } from 'antd'
import { UserCart } from '~/models/userInterface'

interface MenuItem {
    key: string | number
    label: JSX.Element | string
}

interface Props {
    menuData: (UserCart | string)[] | undefined
}

const MenuItems = (props: Props): MenuProps['items'] => {
    const { menuData } = props
    if (menuData === undefined || menuData.length === 0) {
        const emptyItem: MenuItem = {
            key: 'empty',
            label: <Empty />,
        }
        return [emptyItem]
    }
    const menuItems: MenuItem[] = menuData.map((item, index) => {
        if (typeof item === 'string') {
            return {
                key: index,
                label: <div>{item}</div>,
            }
        }
        return {
            key: item._id,
            label: (
                <div>
                    <div className="">
                        <img src={item.product.image[0]} alt="image" />
                        <span>{item.product.productName}</span>
                        <span>{item.product.price}</span>
                    </div>
                </div>
            ),
        }
    })
    return menuItems
}

const MenuItemsOrNull: (data: Props['menuData']) => MenuProps['items'] = (
    data
) => MenuItems({ menuData: data })

export default MenuItemsOrNull
