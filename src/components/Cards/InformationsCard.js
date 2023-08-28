import { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'

import Colors from '../../themes/colors'
import Images from '../../themes/images'

import BasicCard from './BasicCard'
import RoundedSecondaryButton from '../Buttons/RoundedSecondaryButton'
import RoundedPrimaryButton from '../Buttons/RoundedPrimaryButton'

const styles = StyleSheet.create({
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center'
  },
  titleTextStyle: {
    color: Colors.lightBlack,
    fontSize: 18,
    maxWidth: '80%'
  },
  arrowButtonStyle: {
    width: 18,
    height: 18
  }
})

export default function InformationsCard ({
  titleText,
  itemsList,
  actionButtonText,
  actionButtonOnPress,
  isActionButtonLoading,
  isPrimaryButtonAction,
  hasExpansion,
  style,
  titleTextStyle = styles.titleTextStyle
}) {
  // Controls if the card should be expanded or not
  const [isExpanded, setIsExpanded] = useState(false)

  const ArrowIcon = ({ style }) => {
    return (
      <Image
        source={Images.arrowButtonIconBlue}
        style={[styles.arrowButtonStyle, style]}
      />
    )
  }

  return (
    <BasicCard style={style}>
      <TouchableOpacity
        style={styles.cardTitleContainer}
        onPress={() => setIsExpanded(!isExpanded)}
        disabled={!hasExpansion}
      >
        <Text style={titleTextStyle}>{titleText}</Text>
        {hasExpansion && (
          <ArrowIcon
            style={{
              marginLeft: 4,
              transform: [{ rotate: isExpanded ? '90deg' : '270deg' }]
            }}
          />
        )}
      </TouchableOpacity>
      <View style={{ marginLeft: 8 }}>
        {itemsList.map((item, index) => {
          if (!item) return
          const shouldShow = item.showOnlyWhenExpanded ? isExpanded : true
          return (
            shouldShow && (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginBottom: itemsList.length - 1 === index ? 6 : 12,
                  maxWidth: '100%',
                  flexWrap: 'wrap'
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.lightBlack
                  }}
                >
                  {item.label}:{' '}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 14, color: Colors.lightBlack }}>
                    {item.content}{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}
                  >
                    {item.actionText && (
                      <TouchableOpacity
                        style={{
                          borderBottomColor: Colors.lightBlack,
                          borderBottomWidth: 1
                        }}
                        onPress={item.actionTextOnPress}
                      >
                        <Text
                          style={{ fontSize: 14, color: Colors.lightBlack }}
                        >
                          {item.actionText}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {item.icon && (
                      <View style={{ marginLeft: 4 }}>{item.icon}</View>
                    )}
                  </View>
                </View>
              </View>
            )
          )
        })}
      </View>
      {actionButtonText && (
        <View style={{ marginTop: 16 }}>
          {isPrimaryButtonAction ? (
            <RoundedPrimaryButton
              buttonText={actionButtonText}
              style={[{ paddingHorizontal: 8, paddingVertical: 8 }]}
              buttonTextStyle={{ fontSize: 16 }}
              onPress={actionButtonOnPress}
              isLoading={isActionButtonLoading}
            />
          ) : (
            <RoundedSecondaryButton
              buttonText={actionButtonText}
              style={[{ paddingHorizontal: 8, paddingVertical: 8 }]}
              onPress={actionButtonOnPress}
              isLoading={isActionButtonLoading}
            />
          )}
        </View>
      )}
    </BasicCard>
  )
}
