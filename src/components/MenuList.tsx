import { Dropdown, Menu } from 'antd'
import React from 'react'
import { MenuItem } from '~/models'
import icons from '~/utils/icons'

interface Props {
    menuList: MenuItem[]
    children: React.ReactNode
    selectMenuItem?: React.ReactNode
    handleSelect: (value?: MenuItem) => void
}

const { FaCheck } = icons

const MenuList: React.FC<Props> = ({
    menuList,
    children,
    handleSelect,
    selectMenuItem,
}) => {
    const menu = (
        <Menu>
            {menuList?.map((item, index) => (
                <Menu.Item
                    key={index}
                    onClick={() => {
                        if (handleSelect) {
                            return handleSelect(item)
                        }
                    }}
                >
                    <div className="flex justify-between items-center">
                        <span className="hover:text-main">{item.children}</span>
                        <span>
                            {selectMenuItem === item.children && (
                                <FaCheck color="#ee4d2d" />
                            )}
                        </span>
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    )

    return <Dropdown overlay={menu}>{children}</Dropdown>
}

export default MenuList
