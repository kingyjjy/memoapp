import React from 'react'
import {StyleSheet, Platform} from 'react-native'
import {AntDesign} from '@expo/vector-icons'
import colors from '../misc/colors'

const RoundIconBtn = ({antIconName, size, color, style, onPress}) => {
  return (
    <AntDesign
        name={antIconName}
        size={size || 25}
        color={color || colors.LIGHT}
        style={[styles.icon, {...style}]}
        onPress={onPress}
    />
  )
}

const styles = StyleSheet.create({
    icon:{
        backgroundColor:colors.PRIMARY,
        padding:15,
        borderRadius:50,
        ...Platform.select({
            ios:{
                shadowColor:'rgb(50,50,50)',
                shadowOpacity:0.5,
                shadowRadius:5,
                shadowOffset:{
                    height:-1,
                    width:0
                }
            },
            android:{
                elevation:5
            }
        })
    }
})

export default RoundIconBtn